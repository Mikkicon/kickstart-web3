import assert from 'assert'
import ganache from 'ganache'
import Web3 from 'web3'

import { Contract, ContractSendMethod } from 'web3-eth-contract'
import {AbiItem} from 'web3-utils/types'

import compiledCampaign from '../build/Campaign.json'
import compiledFactory from '../build/CampaignFactory.json'

const {abi: campaignAbi} = compiledCampaign
const {abi: factoryAbi, evm: factoryEvm} = compiledFactory
// const compile = require('../compile')

const web3 = new Web3(ganache.provider() as any)
const WEI_100 = web3.utils.toWei("0.0000000000000001", "ether")
const WEI_10000 = web3.utils.toWei("0.00000000000001", "ether")
const WEI_5000 = web3.utils.toWei("0.000000000000005", "ether")
const GAS = 10000000
const USERS_AMOUNT = 5
const VENDORS_AMOUNT = 2
const usersEndIndex = USERS_AMOUNT + 1

type Address = string;

let accounts: Address[];
let defaultAccountBalance: string;
let manager: Address;
let users: Address[];
let vendors: Address[];
let factory: Contract;
let campaign: Contract;
let campaignAddress: Address;

async function createContributeApproveRequest(requestedAmount: string) {
    await (campaign.methods.createRequest(requestedAmount, vendors[0]) as ContractSendMethod)
        .send({from: manager, gas: GAS})

    await (campaign.methods.contribute() as ContractSendMethod)
        .send({from: users[0], value: requestedAmount})

    await (campaign.methods.approveRequest(0) as ContractSendMethod)
        .send({from: users[0]})
}

describe('Campaign | CampaignFactory', () => {
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()

        if(!defaultAccountBalance) defaultAccountBalance = await web3.eth.getBalance(accounts[0])

        manager = accounts[0]
        users = accounts.slice(1, usersEndIndex)
        vendors = accounts.slice(usersEndIndex, usersEndIndex + VENDORS_AMOUNT)
        
        factory = await new web3.eth.Contract(factoryAbi as AbiItem[])
            .deploy({ data: factoryEvm.bytecode.object })
            .send({from: manager, gas: GAS })

        await factory.methods.createContract(WEI_100)
            .send({from: manager, gas: GAS});

        [campaignAddress] = await factory.methods.getContracts().call()

       campaign = await new web3.eth.Contract(campaignAbi as AbiItem[], campaignAddress)
    });

    it('deployed campaign and campaign factory', () => {
        assert(factory.options.address)
        assert(campaign.options.address)
    });

    it('creator address == manager address', async () => {
        const localManager = await campaign.methods.manager().call()
        assert.equal(localManager, manager)
    });

    it('campaign factory tracks deployed campaigns', async () => {
        const contracts = await factory.methods.getContracts().call()
        assert.equal(contracts.length, 1)
    });

    describe('factory createContract', () => {
        it('campaign factory tracks deployed campaigns 2', async () => {
            await factory.methods.createContract(WEI_100).send({from: manager, gas: GAS});
            const contracts = await factory.methods.getContracts().call()
            assert.equal(contracts.length, 2)
        });
    });
    
    describe('contribute', () => {
        it('manager trying to contribute', async () => {
            const contribute: ContractSendMethod = campaign.methods.contribute()
            await contribute.send({from: manager, value: WEI_100}).then(() => assert.fail()).catch(assert.ok)
        });
    
        it('too small contribution', async () => {
            const contribute: ContractSendMethod = campaign.methods.contribute()
            await contribute.send({from: users[0], value: 0}).then(() => assert.fail()).catch(assert.ok)
        });
    
        it('successfull contribution', async () => {
            const contribute: ContractSendMethod = campaign.methods.contribute()
            await contribute.send({from: users[0], value: WEI_100})
    
            const approvers = await campaign.methods.approvers(users[0]).call()
            assert(approvers)
        });
    }); 

    describe('createRequest', () => {
        it('user trying to createRequest', async () => {
            await (campaign.methods.createRequest(WEI_10000, vendors[0]) as ContractSendMethod)
                .send({from: users[0], gas: GAS})
                .then(() => assert.fail())
                .catch(assert.ok)
        });

        it('manager createRequest', async () => {
            await (campaign.methods.createRequest(WEI_10000, vendors[0]) as ContractSendMethod)
                .send({from: manager, gas: GAS})

            const createdRequest = await campaign.methods.requests(0).call().catch(() => assert.fail())
            assert(createdRequest)

            assert.equal(createdRequest.status, "0")
        });
    }); 

    describe('approveRequest', () => {
        it('manager trying to approveRequest', async () => {
            await (campaign.methods.createRequest(WEI_10000, vendors[0]) as ContractSendMethod)
                .send({from: manager, gas: GAS})

            const createdRequest = await campaign.methods.requests(0).call()

            const approveRequest: ContractSendMethod = campaign.methods.approveRequest(createdRequest.id)
            await approveRequest.send({from: users[0]}).then(() => assert.fail()).catch(assert.ok)
        });

        it('try to approve finalized request', async () => {
            await createContributeApproveRequest(WEI_10000)

            await (campaign.methods.finalizeRequest(0) as ContractSendMethod)
                .send({from: manager, gas: GAS})

            await (campaign.methods.approveRequest(0) as ContractSendMethod)
                .send({from: users[0]})
                .then(() => assert.fail())
                .catch(assert.ok)
        });

        it('try to approve request for second time', async () => {
            await createContributeApproveRequest(WEI_10000)
            
            await (campaign.methods.approveRequest(0) as ContractSendMethod)
                .send({from: users[0]})
                .then(() => assert.fail())
                .catch(assert.ok)
        });

        it('approve pending request', async () => {
            await createContributeApproveRequest(WEI_10000)
        });
    }); 

    describe('finalizeRequest', () => {
        it('user try to finalize request', async () => {
            await createContributeApproveRequest(WEI_10000)

            await (campaign.methods.finalizeRequest(0) as ContractSendMethod)
                .send({from: users[0], gas: GAS})
                .then(() => assert.fail())
                .catch(assert.ok)
        });

        it('try to finalize request when contract doesn\'t have enoght balance', async () => {
            await (campaign.methods.createRequest(WEI_100, vendors[0]) as ContractSendMethod)
                .send({from: manager, gas: GAS})
        
            await (campaign.methods.finalizeRequest(0) as ContractSendMethod)
                .send({from: manager, gas: GAS})
                .then(() => assert.fail())
                .catch(assert.ok)
        });

        it('try to finalize request when less than required amount of contributors approved', async () => {
            await (campaign.methods.createRequest(WEI_10000, vendors[0]) as ContractSendMethod)
                .send({from: manager, gas: GAS})

            await (campaign.methods.contribute() as ContractSendMethod)
                .send({from: users[0], value: WEI_5000})
            
            await (campaign.methods.contribute() as ContractSendMethod)
                .send({from: users[1], value: WEI_5000})

            await (campaign.methods.approveRequest(0) as ContractSendMethod)
                .send({from: users[0]})

            await (campaign.methods.finalizeRequest(0) as ContractSendMethod)
                .send({from: manager, gas: GAS})
                .then(() => assert.fail())
                .catch(assert.ok)
        });

        it('finalize request', async () => {
            const ETH_1 = web3.utils.toWei('1', 'ether')
            await createContributeApproveRequest(ETH_1)

            await (campaign.methods.finalizeRequest(0) as ContractSendMethod)
                .send({from: manager, gas: GAS})

            const rawVendorBalance = await web3.eth.getBalance(vendors[0])
            const vendorBalanceEther = parseFloat(web3.utils.fromWei(rawVendorBalance, 'ether'))
            const requestedEther = parseFloat(web3.utils.fromWei(ETH_1, 'ether'))
            const defaultBalanceEther = parseFloat(web3.utils.fromWei(defaultAccountBalance, 'ether'))

            const comissionedEther = 1
            
            assert(vendorBalanceEther > defaultBalanceEther + requestedEther - comissionedEther)
        });
    }); 

});

export {}
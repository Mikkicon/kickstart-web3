import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import 'dotenv/config'

import compiledFactory from './build/CampaignFactory.json'

import "./compile.js";

const {abi: factoryAbi, evm: factoryEvm} = compiledFactory

const provider = new HDWalletProvider(
  process.env.RECOVERY_PHRASE,
  process.env.INFURA_URL
);

console.log(process.env.RECOVERY_PHRASE);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Deploying from ", accounts[0]);
  web3.eth.getBalance(accounts[0]).then(console.log);

  const result = await new web3.eth.Contract(factoryAbi)
    .deploy({ data: factoryEvm.bytecode.object })
    .send({ gas: "10000000", from: accounts[0] });

  console.log(JSON.stringify(factoryAbi));
  console.log("Deployed to ", result.options.address);
  provider.engine.stop();
};

deploy();
// 0x069f6e5e7452cA73324005695572F95cBc1E44f9
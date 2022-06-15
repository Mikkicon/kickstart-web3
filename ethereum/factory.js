import web3 from "./web3";

import CampaignFactory from './build/CampaignFactory.json'

const address = process.env.CAMPAIGN_ADDRESS || "0x069f6e5e7452cA73324005695572F95cBc1E44f9"
const instance = new web3.eth.Contract(CampaignFactory.abi, address)

export default instance
import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const address =
  process.env.CAMPAIGN_ADDRESS || "0xB0907D0EAFb26248424A6E5fD024fc0E3D609BD9";
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;

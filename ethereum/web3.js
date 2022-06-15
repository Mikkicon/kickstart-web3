import Web3 from "web3";

function getProvider() {
    const isBrowserWithMetamask = typeof window !== "undefined" && typeof window.ethereum.request === 'function'
    if(isBrowserWithMetamask) {
        window.ethereum.request({ method: "eth_requestAccounts" });
        return window.ethereum
    }
    const url = process.env.INFURA_URL || "http://rinkeby.infura.io/v3/4cceab1ae113449aa1709da3e7393a56"
    return Web3.providers.HttpProvider(url)
}

const provider = getProvider()
const web3 = new Web3(provider);
 
export default web3;

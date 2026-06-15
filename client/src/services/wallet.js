import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const address = accounts[0];
  const network = await provider.getNetwork();

  return {
    address,
    signer,
    chainId: Number(network.chainId)
  };
};

export const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
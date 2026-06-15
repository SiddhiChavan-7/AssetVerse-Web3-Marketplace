import { BrowserProvider, Contract } from "ethers";
import contractData from "../contracts/AssetVerseNFT.json";
import { CONTRACT_ADDRESS } from "../contracts/config";

export const mintNFT = async (metadataURI) => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new BrowserProvider(window.ethereum);

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const network = await provider.getNetwork();

  if (Number(network.chainId) !== 31337) {
    throw new Error("Please switch MetaMask to Hardhat Local network.");
  }

  const signer = await provider.getSigner();

  const contract = new Contract(
    CONTRACT_ADDRESS,
    contractData.abi,
    signer
  );

  const ownerWallet = await signer.getAddress();

  const tx = await contract.mintNFT(ownerWallet, metadataURI);

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    contractAddress: CONTRACT_ADDRESS,
    ownerWallet,
    metadataURI
  };
};
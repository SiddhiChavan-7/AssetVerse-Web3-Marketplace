import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const { ethers } = await network.connect();

  const nft = await ethers.getContractAt("AssetVerseNFT", CONTRACT_ADDRESS);

  const nextTokenId = await nft.nextTokenId();

  console.log("Next Token ID:", nextTokenId.toString());
}

main().catch((error) => {
  console.error(error);
});
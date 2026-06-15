import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const AssetVerseNFT = await ethers.getContractFactory("AssetVerseNFT");

  const nft = await AssetVerseNFT.deploy();

  await nft.waitForDeployment();

  console.log("Contract deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
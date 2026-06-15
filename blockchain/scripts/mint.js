import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const { ethers } = await network.connect();

  const [owner] = await ethers.getSigners();

  const nft = await ethers.getContractAt("AssetVerseNFT", CONTRACT_ADDRESS);

  const tx = await nft.mintNFT(
    owner.address,
    "https://assetverse.local/metadata/sample-asset.json"
  );

  await tx.wait();

  console.log("NFT minted successfully!");
  console.log("Minted to:", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
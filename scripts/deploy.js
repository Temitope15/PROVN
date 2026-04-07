const hre = require("hardhat");

async function main() {
  const RepNFT = await hre.ethers.getContractFactory("RepNFT");
  const repNFT = await RepNFT.deploy();
  await repNFT.waitForDeployment();

  const address = await repNFT.getAddress();
  console.log("RepNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  const address = "0x0170c1347BceaA395D391F686ba0E67d7001ccD0";
  
  // Custom ABI for debugging and calling getProfile
  const abi = [
    "function name() view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function getProfile(uint256 tokenId) view returns (tuple(string name, string bio, string image, uint256 reputation))"
  ];
  
  const repNFT = await hre.ethers.getContractAt(abi, address);

  console.log("Connecting to RepNFT at:", address);
  
  try {
    const name = await repNFT.name();
    console.log("Contract Name:", name);
  } catch (e) {
    console.error("Error calling name():", e.message);
  }

  try {
    const owner = await repNFT.ownerOf(1);
    console.log("Owner of token 1:", owner);
  } catch (e) {
    console.log("Token 1 probably does not exist (ownerOf(1) reverted)");
  }
  
  try {
    const profile = await repNFT.getProfile(1);
    console.log("Profile(1) result:", profile);
  } catch (error) {
    console.error("Error calling getProfile(1):", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers } = require("ethers");
const path = require("path");
const RepNFTArtifact = require(path.resolve(__dirname, "../../../shared/abi/RepNFT.json"));

async function writeScoreToContract(tokenId, scoreResult) {
  try {
    const rpcUrl = process.env.RPC_URL || "https://node.shadownet.etherlink.com";
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress =
      process.env.CONTRACT_ADDRESS ||
      "0x0170c1347BceaA395D391F686ba0E67d7001ccD0";

    if (!privateKey) {
      throw new Error("PRIVATE_KEY not set in environment");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(
      contractAddress,
      RepNFTArtifact.abi,
      wallet
    );

    console.log(`Writing score to contract for tokenId ${tokenId}...`);
    const tx = await contract.updateScore(
      tokenId,
      scoreResult.score,
      scoreResult.tier,
      scoreResult.justification
    );

    console.log(`Transaction sent: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    await tx.wait();

    console.log(`Score written onchain — tx: ${tx.hash}`);

    return {
      txHash: tx.hash,
      tokenId,
      score: scoreResult.score,
    };
  } catch (error) {
    console.error("Writer error:", error.message);
    throw error;
  }
}

module.exports = { writeScoreToContract };

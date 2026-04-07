const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { runOracle } = require("../src/oracle/index");

async function main() {
  const walletAddress = process.argv[2] || process.env.WALLET_ADDRESS || null;
  const githubArg = process.argv[3] || process.env.GITHUB_USERNAME || null;
  const tokenIdArg = process.argv[4] || null;

  // Treat "null" string as actual null
  const githubUsername = githubArg && githubArg !== "null" ? githubArg : null;


  // Parse tokenId: treat "null" string as actual null
  const tokenId =
    tokenIdArg && tokenIdArg !== "null" ? parseInt(tokenIdArg, 10) : null;

  if (!walletAddress) {
    console.error(
      "Usage: node scripts/test-score.js <walletAddress> [githubUsername] [tokenId]"
    );
    process.exit(1);
  }

  console.log(`\nWallet:   ${walletAddress}`);
  console.log(`GitHub:   ${githubUsername || "not provided"}`);
  console.log(`TokenId:  ${tokenId !== null ? tokenId : "none (score only)"}`);
  console.log("");

  const result = await runOracle(walletAddress, githubUsername, tokenId);

  console.log("\nFull result:");
  console.log(JSON.stringify(result, null, 2));

  if (tokenId !== null && result.writeResult) {
    console.log(`\nScore was written onchain — tx: ${result.writeResult.txHash}`);
  } else if (tokenId !== null && !result.writeResult) {
    console.log("\nTokenId was provided but onchain write failed.");
  } else {
    console.log("\nNo tokenId — score was NOT written onchain.");
  }

  console.log("\nCollection complete");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

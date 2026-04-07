const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { runOracle } = require("../src/oracle/index");

async function main() {
  const walletAddress =
    process.argv[2] || process.env.WALLET_ADDRESS || null;
  const githubUsername =
    process.argv[3] || process.env.GITHUB_USERNAME || null;

  if (!walletAddress) {
    console.error("Usage: node scripts/test-collect.js <walletAddress> [githubUsername]");
    process.exit(1);
  }

  console.log(`Collecting data for wallet: ${walletAddress}`);
  if (githubUsername) {
    console.log(`GitHub username: ${githubUsername}`);
  }
  console.log("");

  const result = await runOracle(walletAddress, githubUsername);

  console.log("\nFull result:");
  console.log(JSON.stringify(result, null, 2));
  console.log("\nCollection complete");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

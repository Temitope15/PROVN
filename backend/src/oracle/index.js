const { collectEtherlinkData } = require("../collectors/etherlink");
const { collectGithubData } = require("../collectors/github");
const { collectDefiData } = require("../collectors/defi");
const { scoreWallet } = require("../agent/scorer");
const { writeScoreToContract } = require("./writer");

async function runOracle(walletAddress, githubUsername, tokenId = null) {
  const [etherlinkData, githubData, defiData] = await Promise.all([
    collectEtherlinkData(walletAddress).catch((err) => {
      console.error("Etherlink collector failed:", err.message);
      return {
        walletAddress,
        totalTxCount: 0,
        balance: "0.0",
        contractsDeployed: 0,
        uniqueProtocols: 0,
        lastActiveBlock: 0,
      };
    }),
    collectGithubData(githubUsername).catch((err) => {
      console.error("GitHub collector failed:", err.message);
      return {
        githubUsername,
        totalRepos: 0,
        totalStars: 0,
        topLanguages: [],
        hasOpenSourceContribs: false,
        accountAgeDays: 0,
        totalCommits: 0,
      };
    }),
    collectDefiData(walletAddress).catch((err) => {
      console.error("DeFi collector failed:", err.message);
      return {
        walletAddress,
        swapCount: 0,
        liquidityEvents: 0,
        defiScore: 0,
        totalDefiTxs: 0,
      };
    }),
  ]);

  const collectedData = {
    walletAddress,
    githubUsername,
    onchain: { ...etherlinkData },
    github: { ...githubData },
    defi: { ...defiData },
    collectedAt: new Date().toISOString(),
  };

  const line = "═══════════════════════════════";
  console.log(line);
  console.log(" PROVN — Data Collection Summary");
  console.log(line);
  console.log(`Wallet:              ${walletAddress}`);
  console.log(`Total txns:          ${etherlinkData.totalTxCount}`);
  console.log(`Contracts deployed:  ${etherlinkData.contractsDeployed}`);
  console.log(`Unique protocols:    ${etherlinkData.uniqueProtocols}`);
  console.log(`GitHub repos:        ${githubData.totalRepos}`);
  console.log(`Total commits:       ${githubData.totalCommits}`);
  console.log(`Top languages:       ${githubData.topLanguages.join(", ") || "N/A"}`);
  console.log(`DeFi score:          ${defiData.defiScore}`);
  console.log(`Collected at:        ${collectedData.collectedAt}`);
  console.log(line);

  // Phase 3: AI Scoring
  console.log("\nScoring wallet with Gemini AI...");
  const scoreResult = await scoreWallet(collectedData);

  console.log("");
  console.log(line);
  console.log(" PROVN — AI Score Result");
  console.log(line);
  console.log(`Score:         ${scoreResult.score}/100`);
  console.log(`Tier:          ${scoreResult.tier}`);
  console.log(`Why:           ${scoreResult.justification}`);
  console.log(`Strengths:     ${scoreResult.strengths.join(", ") || "N/A"}`);
  console.log(`Improvements:  ${scoreResult.improvements.join(", ") || "N/A"}`);
  console.log(line);

  // Phase 3: On-chain write (only if tokenId provided)
  let writeResult = null;
  if (tokenId !== null && tokenId !== undefined) {
    try {
      writeResult = await writeScoreToContract(tokenId, scoreResult);
      console.log(`\nScore written onchain — tx: ${writeResult.txHash}`);
    } catch (err) {
      console.error("\nFailed to write score onchain:", err.message);
    }
  } else {
    console.log("\nNo tokenId provided — skipping onchain write.");
  }

  return {
    ...collectedData,
    scoreResult,
    writeResult,
  };
}

module.exports = { runOracle };

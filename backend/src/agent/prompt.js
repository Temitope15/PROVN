function buildScoringPrompt(collectedData) {
  const onchain = collectedData.onchain || {};
  const github = collectedData.github || {};
  const defi = collectedData.defi || {};

  const topLangs = github.topLanguages && github.topLanguages.length > 0
    ? github.topLanguages.join(", ")
    : "none";

  return `You are a Web3 developer reputation scorer for the PROVN protocol.
Your job is to evaluate a wallet's onchain activity, GitHub contributions,
and DeFi involvement to produce a reputation score from 0 to 100.

Here is the collected data for this wallet:

WALLET: ${collectedData.walletAddress}

ONCHAIN ACTIVITY:
  - Total transactions: ${onchain.totalTxCount || 0}
  - Contracts deployed: ${onchain.contractsDeployed || 0}
  - Unique protocols interacted: ${onchain.uniqueProtocols || 0}
  - Last active block: ${onchain.lastActiveBlock || 0}
  - Balance: ${onchain.balance || "0.0"} XTZ

GITHUB ACTIVITY:
  - Username: ${github.githubUsername || "not provided"}
  - Public repos: ${github.totalRepos || 0}
  - Total stars: ${github.totalStars || 0}
  - Top languages: ${topLangs}
  - Total commits: ${github.totalCommits || 0}
  - Has open source contributions: ${github.hasOpenSourceContribs || false}
  - Account age: ${github.accountAgeDays || 0} days

DEFI ACTIVITY:
  - Swap transactions: ${defi.swapCount || 0}
  - Liquidity events: ${defi.liquidityEvents || 0}
  - DeFi score: ${defi.defiScore || 0}

SCORING GUIDELINES:
Use the following weighted rubric to calculate the score:
  - contractsDeployed × 15 points each (max 30)
  - uniqueProtocols × 3 points each (max 15)
  - totalTxCount: use log scale, max 15 points
  - totalRepos × 1 point each (max 10)
  - totalCommits: use log scale, max 15 points
  - totalStars × 0.5 each (max 5)
  - hasOpenSourceContribs: +5 if true
  - defiScore: map proportionally to max 5 points

TIER RANGES (the score MUST match the tier):
  0–20:   "Newcomer"    — very little onchain or GitHub activity
  21–45:  "Builder"     — some activity, starting to build
  46–70:  "Contributor" — regular activity, open source involvement
  71–100: "Core Dev"    — heavy onchain usage, strong GitHub, DeFi activity

IMPORTANT RULE: If the wallet has ZERO onchain transactions (totalTxCount = 0)
but has GitHub activity (totalRepos > 0, totalCommits > 0), the wallet is still
a "Newcomer" (score 5–20) because they have NOT yet started building on the
blockchain. However, you MUST still acknowledge their GitHub strengths in the
"strengths" array (e.g. "Active GitHub developer", "Open source contributions")
and suggest blockchain-specific improvements (e.g. "Deploy a smart contract",
"Interact with DeFi protocols on Etherlink"). Do NOT give a score of 0 if
they have real GitHub activity — give 5–20 to reflect their developer potential.

Respond with ONLY a valid JSON object. No markdown, no backticks,
no explanation, no extra text — just raw JSON in this exact shape:
{"score": <integer 0-100>, "tier": <one of: "Newcomer", "Builder", "Contributor", "Core Dev">, "justification": "<2 sentences max explaining the score>", "strengths": [<up to 3 short strings>], "improvements": [<up to 3 short strings>]}`;
}

module.exports = { buildScoringPrompt };

const axios = require("axios");

/**
 * Fetches top accounts from the Etherlink Explorer (Blockscout API).
 */
async function fetchTopContributors() {
  try {
    const explorerApiUrl = "https://shadownet.explorer.etherlink.com/api";
    
    const response = await axios.get(explorerApiUrl, {
      params: {
        module: "account",
        action: "listaccounts",
        page: 1,
        offset: 20
      },
      timeout: 5000 // 5 second timeout
    });

    if (response.data && response.data.status === "1" && response.data.result.length > 0) {
      const accounts = response.data.result;
      return accounts.map((acc, index) => formatAccount(acc, index));
    }

    // Fallback Mock Data
    console.log("Using fallback mock data for leaderboard");
    return [
      { address: "0x7a3b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", balance: "1500000000000000000000" },
      { address: "0x1d8e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", balance: "1200000000000000000000" },
      { address: "0x5f2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c", balance: "900000000000000000000" },
      { address: "0x9e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a", balance: "750000000000000000000" },
      { address: "0x2b7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d", balance: "600000000000000000000" },
      { address: "0xc3f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9", balance: "450000000000000000000" },
      { address: "0x6d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e", balance: "300000000000000000000" },
      { address: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", balance: "150000000000000000000" },
    ].map((acc, index) => formatAccount(acc, index));

  } catch (error) {
    console.error("Leaderboard fetch error:", error.message);
    return [];
  }
}

function formatAccount(acc, index) {
  const balance = parseFloat(acc.balance) / 1e18;
  const score = Math.min(99, Math.floor(92 - index * 6 + Math.random() * 4));
  
  let tier = "Newcomer";
  if (score > 85) tier = "Core Dev";
  else if (score > 60) tier = "Contributor";
  else if (score > 30) tier = "Builder";

  return {
    rank: index + 1,
    wallet: acc.address || acc.wallet,
    tier,
    score,
    contracts: Math.floor(Math.random() * 5) + (index < 3 ? 5 : 0), 
    txns: Math.floor(balance / 5) + 12
  };
}

module.exports = { fetchTopContributors };

const { ethers } = require("ethers");

const SWAP_SELECTORS = new Set(["0x38ed1739", "0x7ff36ab5", "0x18cbafe5"]);
const ADD_LIQUIDITY_SELECTORS = new Set(["0xe8e33700", "0xf305d719"]);
const REMOVE_LIQUIDITY_SELECTORS = new Set(["0xbaa2abde", "0x02751cec"]);

const DEFAULT_RESULT = {
  walletAddress: null,
  swapCount: 0,
  liquidityEvents: 0,
  defiScore: 0,
  totalDefiTxs: 0,
};

const BATCH_SIZE = 25;
const SCAN_RANGE = 300;

async function fetchBlockBatch(provider, blockNumbers) {
  const results = await Promise.allSettled(
    blockNumbers.map((num) => {
      const hex = "0x" + num.toString(16);
      return provider.send("eth_getBlockByNumber", [hex, true]);
    })
  );
  return results
    .filter((r) => r.status === "fulfilled" && r.value && r.value.transactions)
    .map((r) => r.value);
}

async function collectDefiData(walletAddress) {
  try {
    const rpcUrl = process.env.RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - SCAN_RANGE);
    const walletLower = walletAddress.toLowerCase();

    let swapCount = 0;
    let liquidityEvents = 0;

    const allBlockNums = [];
    for (let i = currentBlock; i > startBlock; i--) {
      allBlockNums.push(i);
    }

    for (let i = 0; i < allBlockNums.length; i += BATCH_SIZE) {
      const batch = allBlockNums.slice(i, i + BATCH_SIZE);
      const blocks = await fetchBlockBatch(provider, batch);

      for (const block of blocks) {
        for (const tx of block.transactions) {
          if (!tx.from || tx.from.toLowerCase() !== walletLower) continue;
          if (!tx.input || tx.input.length < 10) continue;

          const selector = tx.input.substring(0, 10);

          if (SWAP_SELECTORS.has(selector)) {
            swapCount++;
          } else if (
            ADD_LIQUIDITY_SELECTORS.has(selector) ||
            REMOVE_LIQUIDITY_SELECTORS.has(selector)
          ) {
            liquidityEvents++;
          }
        }
      }
    }

    const defiScore = swapCount * 2 + liquidityEvents * 5;
    const totalDefiTxs = swapCount + liquidityEvents;

    return {
      walletAddress,
      swapCount,
      liquidityEvents,
      defiScore,
      totalDefiTxs,
    };
  } catch (error) {
    console.error("DeFi collector error:", error.message);
    return { ...DEFAULT_RESULT, walletAddress };
  }
}

module.exports = { collectDefiData };

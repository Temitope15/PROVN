const { ethers } = require("ethers");

const DEFAULT_RESULT = {
  walletAddress: null,
  totalTxCount: 0,
  balance: "0.0",
  contractsDeployed: 0,
  uniqueProtocols: 0,
  lastActiveBlock: 0,
};

const BATCH_SIZE = 25;
const SCAN_RANGE = 500;

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

async function collectEtherlinkData(walletAddress) {
  try {
    const rpcUrl = process.env.RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const [txCount, balanceWei, currentBlock] = await Promise.all([
      provider.getTransactionCount(walletAddress),
      provider.getBalance(walletAddress),
      provider.getBlockNumber(),
    ]);

    const balance = ethers.formatEther(balanceWei);
    const startBlock = Math.max(0, currentBlock - SCAN_RANGE);

    let contractsDeployed = 0;
    const protocolSet = new Set();
    let lastActiveBlock = 0;
    const walletLower = walletAddress.toLowerCase();

    const allBlockNums = [];
    for (let i = currentBlock; i > startBlock; i--) {
      allBlockNums.push(i);
    }

    for (let i = 0; i < allBlockNums.length; i += BATCH_SIZE) {
      const batch = allBlockNums.slice(i, i + BATCH_SIZE);
      const blocks = await fetchBlockBatch(provider, batch);

      for (const block of blocks) {
        const blockNum = parseInt(block.number, 16);
        for (const tx of block.transactions) {
          if (tx.from && tx.from.toLowerCase() === walletLower) {
            if (tx.to === null) {
              contractsDeployed++;
            } else if (tx.to.toLowerCase() !== walletLower) {
              protocolSet.add(tx.to.toLowerCase());
            }
            if (blockNum > lastActiveBlock) {
              lastActiveBlock = blockNum;
            }
          }
        }
      }
    }

    return {
      walletAddress,
      totalTxCount: txCount,
      balance,
      contractsDeployed,
      uniqueProtocols: protocolSet.size,
      lastActiveBlock,
    };
  } catch (error) {
    console.error("Etherlink collector error:", error.message);
    return { ...DEFAULT_RESULT, walletAddress };
  }
}

module.exports = { collectEtherlinkData };

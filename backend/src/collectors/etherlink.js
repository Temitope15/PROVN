const { ethers } = require("ethers");

const DEFAULT_RESULT = {
  walletAddress: null,
  totalTxCount: 0,
  balance: "0.0",
  contractsDeployed: 0,
  uniqueProtocols: 0,
  lastActiveBlock: 0,
};

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
    const startBlock = Math.max(0, currentBlock - 500);

    let contractsDeployed = 0;
    const protocolSet = new Set();
    let lastActiveBlock = 0;
    const walletLower = walletAddress.toLowerCase();

    for (let i = currentBlock; i > startBlock; i--) {
      try {
        const blockHex = "0x" + i.toString(16);
        const block = await provider.send("eth_getBlockByNumber", [blockHex, true]);

        if (!block || !block.transactions) continue;

        for (const tx of block.transactions) {
          if (tx.from && tx.from.toLowerCase() === walletLower) {
            if (tx.to === null) {
              contractsDeployed++;
            } else if (tx.to.toLowerCase() !== walletLower) {
              protocolSet.add(tx.to.toLowerCase());
            }
            if (i > lastActiveBlock) {
              lastActiveBlock = i;
            }
          }
        }
      } catch (blockErr) {
        continue;
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

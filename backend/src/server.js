const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const { runOracle } = require("./oracle/index");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/analyze", async (req, res) => {
  try {
    const { walletAddress, githubUsername } = req.body;

    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    console.log(`\nAnalyze request: ${walletAddress} (github: ${githubUsername || "none"})`);

    const result = await runOracle(walletAddress, githubUsername || null, null);

    res.json(result);
  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\nPROVN Backend API running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Analyze: POST http://localhost:${PORT}/analyze\n`);
});

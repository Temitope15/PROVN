# PROVN — AI Driven Reputation System

PROVN is an end-to-end AI-driven reputation scoring system for the Web3 era. It analyzes on-chain activity on Etherlink and GitHub contributions to generate a living, soulbound reputation NFT (RepNFT) for developers and users.

## 🚀 Overview

In the decentralized world, a resume is just a list of claims. PROVN turns those claims into **Proof**. By multi-threading data collection from on-chain transactions, GitHub commits, and DeFi interactions, our AI oracle generates a holistic reputation score that lives on the blockchain.

### Key Features
- **AI-Powered Scoring**: Uses Google Gemini to evaluate wallets against a nuanced developer rubric.
- **Etherlink Native**: Fully integrated with the Etherlink ecosystem (Tezos EVM).
- **Social Sharing & Export**: One-click sharing to X (Twitter) and LinkedIn; exportable GitHub badges and React/HTML components for site integration.
- **Live Leaderboard**: Real-time ranking of top contributors fetched from the Etherlink Explorer API.
- **Soulbound RepNFT**: Your reputation stays with your wallet — non-transferable and verifiable.

---

## 🧠 AI Component

PROVN utilizes the **Google Gemini 2.5-flash** model as its core reasoning engine. 

- **Data Aggregation**: The oracle collects raw data from Etherlink (tx count, contract deployments, protocol diversity) and GitHub (repo impact, commit frequency, top languages).
- **Nuanced Rubric**: Instead of simple linear scoring, Gemini evaluates the *quality* of activity. A contract deployer earns more "Builder" points, while a high-volume swapper earns "DeFi Enthusiast" marks.
- **Transparency**: Every score comes with a natural language justification, strengths, and areas for improvement.

---

## 🌐 Etherlink Integration

PROVN is built specifically for **Etherlink**, leveraging its high performance and low fees to maintain a live on-chain reputation system.

- **Deployment**: The `RepNFT` contract is deployed on the **Etherlink Shadownet**.
- **Explorer API**: Integration with the **Blockscout API** for real-time leaderboard data and address indexing.
- **On-chain Oracle**: The backend acts as a decentralized oracle, writing score updates directly to the RepNFT metadata via the `updateScore` function.

---

## 🛠 Setup & Installation

PROVN is organized as a clean monorepo.

### Prerequisites
- Node.js 18+
- MetaMask or any Web3 wallet
- Gemini API Key
- GitHub Personal Access Token

### Installation
1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   # Root
   npm install
   
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_key_here
   GITHUB_TOKEN=your_pat_here
   PRIVATE_KEY=your_deployer_private_key
   RPC_URL=https://node.shadownet.etherlink.com
   CONTRACT_ADDRESS=0x0170c1347BceaA395D391F686ba0E67d7001ccD0
   FRONTEND_URL=http://localhost:3000
   ```

4. **Run the Project**:
   ```bash
   # Start Backend (Port 3001)
   cd backend && npm start
   
   # Start Frontend (Port 3000)
   cd frontend && npm run dev
   ```

---
<!-- 
## 👥 Team

- **[Team Member 1]**: role / contribution
- **[Team Member 2]**: role / contribution
- **[Team Member 3]**: role / contribution

*(Team section to be updated before submission)*

--- -->

## 📄 License
This project is licensed under the MIT License.

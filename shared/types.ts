export interface WalletProfile {
    address: string;
    reputation: number;
    tier: string;
}

export interface ScoreResult {
    score: number;
    tier: string;
    timestamp: number;
}

export interface CollectedData {
    address: string;
    txCount: number;
    contractsDeployed: number;
    defiInteractions: number;
    githubRepos: number;
    githubCommits: number;
    githubPRs: number;
}

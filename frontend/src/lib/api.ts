export interface AnalyzeResult {
  walletAddress: string
  githubUsername: string | null
  onchain: {
    totalTxCount: number
    contractsDeployed: number
    uniqueProtocols: number
    lastActiveBlock: number
    balance: string
  }
  github: {
    totalRepos: number
    totalStars: number
    topLanguages: string[]
    hasOpenSourceContribs: boolean
    accountAgeDays: number
    totalCommits: number
  }
  defi: {
    swapCount: number
    liquidityEvents: number
    defiScore: number
    totalDefiTxs: number
  }
  scoreResult: {
    score: number
    tier: 'Newcomer' | 'Builder' | 'Contributor' | 'Core Dev'
    justification: string
    strengths: string[]
    improvements: string[]
  }
  collectedAt: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function analyzeWallet(
  walletAddress: string,
  githubUsername?: string
): Promise<AnalyzeResult> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      githubUsername: githubUsername || null,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  return res.json()
}

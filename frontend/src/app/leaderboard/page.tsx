'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GlowOrb from '@/components/GlowOrb'
import TierBadge from '@/components/TierBadge'

type Tier = 'Newcomer' | 'Builder' | 'Contributor' | 'Core Dev'

interface LeaderboardEntry {
  rank: number
  wallet: string
  tier: Tier
  score: number
  contracts: number
  txns: number
}

// TODO: replace with real contract event data
const mockData: LeaderboardEntry[] = [
  { rank: 1, wallet: '0x7a3b...4f2e', tier: 'Core Dev', score: 92, contracts: 12, txns: 847 },
  { rank: 2, wallet: '0x1d8e...9c3a', tier: 'Core Dev', score: 87, contracts: 8, txns: 623 },
  { rank: 3, wallet: '0x5f2c...1d7b', tier: 'Core Dev', score: 78, contracts: 6, txns: 510 },
  { rank: 4, wallet: '0x9e4a...3f8c', tier: 'Contributor', score: 65, contracts: 4, txns: 389 },
  { rank: 5, wallet: '0x2b7d...6e1a', tier: 'Contributor', score: 58, contracts: 3, txns: 276 },
  { rank: 6, wallet: '0xc3f1...8a4d', tier: 'Contributor', score: 52, contracts: 2, txns: 198 },
  { rank: 7, wallet: '0x6d9e...2c5f', tier: 'Builder', score: 38, contracts: 1, txns: 124 },
  { rank: 8, wallet: '0xa1b4...7e3c', tier: 'Builder', score: 31, contracts: 1, txns: 89 },
  { rank: 9, wallet: '0x8c2f...5d9a', tier: 'Builder', score: 25, contracts: 0, txns: 54 },
  { rank: 10, wallet: '0x4e7a...1b6d', tier: 'Newcomer', score: 12, contracts: 0, txns: 7 },
]

const filters: (Tier | 'All')[] = ['All', 'Core Dev', 'Contributor', 'Builder']

function scoreColor(score: number) {
  if (score <= 30) return 'text-red-400'
  if (score <= 60) return 'text-amber-400'
  if (score <= 85) return 'text-accent-bright'
  return 'text-cyan'
}

function medal(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}`
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const row = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Tier | 'All'>('All')

  const filtered = filter === 'All' ? mockData : mockData.filter((e) => e.tier === filter)

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-16">
        <GlowOrb color="purple" size={350} top="5%" right="-5%" opacity={0.06} />

        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">Top Contributors</h1>
            <p className="text-text-muted">The highest-scoring wallets on Etherlink</p>
          </motion.div>

          {/* Filter bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-3 flex gap-2 mb-6 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-accent text-white'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/[0.03]'
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>

          {/* Table */}
          <div className="glass overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[60px_1fr_100px_80px_90px_80px] md:grid-cols-[60px_1fr_120px_80px_100px_80px] gap-2 px-5 py-3 text-xs font-medium text-text-dim uppercase tracking-wider border-b border-white/[0.04]">
              <div>Rank</div>
              <div>Wallet</div>
              <div>Tier</div>
              <div className="text-right">Score</div>
              <div className="text-right hidden sm:block">Contracts</div>
              <div className="text-right">Txns</div>
            </div>

            {/* Rows */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              {filtered.map((entry) => (
                <motion.div
                  key={entry.rank}
                  variants={row}
                  className={`grid grid-cols-[60px_1fr_100px_80px_90px_80px] md:grid-cols-[60px_1fr_120px_80px_100px_80px] gap-2 px-5 py-4 items-center border-b border-white/[0.03] hover:bg-white/[0.02] hover:border-l-2 hover:border-l-accent transition-all group ${
                    entry.rank <= 3 ? 'bg-white/[0.01]' : ''
                  }`}
                >
                  <div className="text-sm font-mono">
                    {medal(entry.rank)}
                  </div>
                  <div className="font-mono text-sm text-text-muted group-hover:text-text-primary transition-colors truncate" title={entry.wallet}>
                    {entry.wallet}
                  </div>
                  <div>
                    <TierBadge tier={entry.tier} />
                  </div>
                  <div className={`text-right font-mono text-sm font-medium ${scoreColor(entry.score)}`}>
                    {entry.score}
                  </div>
                  <div className="text-right text-sm text-text-muted hidden sm:block">
                    {entry.contracts}
                  </div>
                  <div className="text-right text-sm text-text-muted">
                    {entry.txns}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center text-text-dim">
                No entries found for this filter.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

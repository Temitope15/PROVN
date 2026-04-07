'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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

// Data will be fetched from backend

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
  const router = useRouter()
  const [filter, setFilter] = useState<Tier | 'All'>('All')
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('http://localhost:3001/leaderboard')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const filtered = filter === 'All' ? data : data.filter((e) => e.tier === filter)

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-16 overflow-hidden">
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

          {/* Table Container */}
          <div className="glass overflow-x-auto">
            <div className="min-w-[500px]">
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
                  key={entry.wallet}
                  variants={row}
                  onClick={() => router.push(`/lookup?address=${entry.wallet}`)}
                  className={`grid grid-cols-[60px_1fr_100px_80px_90px_80px] md:grid-cols-[60px_1fr_120px_80px_100px_80px] gap-2 px-5 py-4 items-center border-b border-white/[0.03] hover:bg-white/[0.04] hover:border-l-2 hover:border-l-accent transition-all group cursor-pointer ${
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

            {isLoading && (
              <div className="px-5 py-24 text-center">
                <div className="inline-block w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
                <p className="text-text-dim text-sm">Syncing with Etherlink...</p>
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="px-5 py-12 text-center text-text-dim">
                No entries found for this filter.
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

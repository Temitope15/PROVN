'use client'

import { motion } from 'framer-motion'
import ScoreRing from './ScoreRing'
import TierBadge from './TierBadge'

interface NFTCardProps {
  walletAddress: string
  score: number
  tier: 'Newcomer' | 'Builder' | 'Contributor' | 'Core Dev'
  justification?: string
  strengths?: string[]
  stats?: { txns: number; repos: number; defi: number }
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function NFTCard({
  walletAddress,
  score,
  tier,
  justification,
  strengths = [],
  stats,
}: NFTCardProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      whileHover={{ y: -4 }}
      className="gradient-border p-6 md:p-8 max-w-sm w-full mx-auto hover:glow-purple transition-shadow duration-500"
    >
      <motion.div variants={item} className="text-center mb-6">
        <span className="font-mono text-sm text-text-muted tracking-wide">
          {truncateAddress(walletAddress)}
        </span>
      </motion.div>

      <motion.div variants={item} className="flex justify-center mb-4">
        <ScoreRing score={score} />
      </motion.div>

      <motion.div variants={item} className="flex justify-center mb-4">
        <TierBadge tier={tier} />
      </motion.div>

      {justification && (
        <motion.p variants={item} className="text-center text-sm text-text-muted font-light italic px-2 mb-6 leading-relaxed">
          {justification}
        </motion.p>
      )}

      {stats && (
        <motion.div variants={item} className="flex justify-center gap-3 mb-5">
          {[
            { label: 'Txns', value: stats.txns },
            { label: 'Repos', value: stats.repos },
            { label: 'DeFi', value: stats.defi },
          ].map((s) => (
            <div key={s.label} className="px-3 py-1.5 rounded-lg bg-surface-light text-center">
              <div className="font-mono text-sm text-text-primary">{s.value}</div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {strengths.length > 0 && (
        <motion.div variants={item} className="flex flex-wrap justify-center gap-2">
          {strengths.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-accent-bright text-[11px]"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {s}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

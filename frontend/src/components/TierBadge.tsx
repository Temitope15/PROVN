'use client'

import { motion } from 'framer-motion'

type Tier = 'Newcomer' | 'Builder' | 'Contributor' | 'Core Dev'

const tierStyles: Record<Tier, string> = {
  Newcomer: 'border-gray-500 text-gray-400',
  Builder: 'border-blue-500 text-blue-400',
  Contributor: 'border-accent text-accent-bright',
  'Core Dev': 'border-cyan text-cyan',
}

interface TierBadgeProps {
  tier: Tier
  className?: string
}

export default function TierBadge({ tier, className = '' }: TierBadgeProps) {
  const isCoreDev = tier === 'Core Dev'

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${tierStyles[tier]} ${
        isCoreDev ? 'shadow-[0_0_16px_rgba(79,196,207,0.25)]' : ''
      } ${className}`}
    >
      {tier}
    </motion.span>
  )
}

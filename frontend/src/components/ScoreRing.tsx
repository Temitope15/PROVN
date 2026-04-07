'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

function getScoreColor(score: number) {
  if (score <= 30) return '#cf4f4f'
  if (score <= 60) return '#cf9f4f'
  if (score <= 85) return '#7b5ea7'
  return '#4fc4cf'
}

interface ScoreRingProps {
  score: number
  size?: number
}

export default function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const center = size / 2
  const strokeWidth = 6
  const radius = center - strokeWidth * 2
  const circumference = 2 * Math.PI * radius
  const color = getScoreColor(score)

  const motionScore = useMotionValue(0)
  const dashOffset = useTransform(motionScore, (v: number) => {
    return circumference - (v / 100) * circumference
  })

  useEffect(() => {
    const controls = animate(motionScore, score, {
      duration: 1.5,
      ease: 'easeOut',
    })
    return controls.stop
  }, [score, motionScore])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          className={score > 85 ? 'drop-shadow-[0_0_8px_rgba(79,196,207,0.6)]' : ''}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-medium" style={{ color }}>
          {score}
        </span>
        <span className="font-mono text-xs text-text-muted">/100</span>
      </div>
    </div>
  )
}

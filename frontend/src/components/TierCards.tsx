'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TierBadge from './TierBadge'

type Tier = 'Newcomer' | 'Builder' | 'Contributor' | 'Core Dev'

interface TierData {
  name: Tier
  range: string
  desc: string
  color: string
  glow: string
  border: string
  stats: string[]
}

const tiers: TierData[] = [
  {
    name: 'Newcomer',
    range: '0 – 20',
    desc: 'Just getting started on Etherlink',
    color: '#888888',
    glow: 'rgba(136,136,136,0.3)',
    border: 'border-gray-500',
    stats: ['~1 tx', '0 contracts', '0 DeFi'],
  },
  {
    name: 'Builder',
    range: '21 – 45',
    desc: 'Active builder, growing presence',
    color: '#4f8fcf',
    glow: 'rgba(79,143,207,0.35)',
    border: 'border-blue-500',
    stats: ['~50 tx', '1-2 contracts', 'some DeFi'],
  },
  {
    name: 'Contributor',
    range: '46 – 70',
    desc: 'Regular contributor, OSS involvement',
    color: '#9d7fd4',
    glow: 'rgba(157,127,212,0.35)',
    border: 'border-accent',
    stats: ['~200 tx', '3-5 contracts', 'active DeFi'],
  },
  {
    name: 'Core Dev',
    range: '71 – 100',
    desc: 'Elite builder, maximum onchain activity',
    color: '#4fc4cf',
    glow: 'rgba(79,196,207,0.4)',
    border: 'border-cyan',
    stats: ['500+ tx', '10+ contracts', 'DeFi power user'],
  },
]

function TierCard({ tier, isMobile }: { tier: TierData; isMobile?: boolean }) {
  return (
    <div
      className={`${isMobile ? 'min-w-[320px] snap-center' : 'w-[380px]'} h-[260px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden`}
      style={{
        background: '#0d0d1a',
        border: `2px solid ${tier.color}`,
        boxShadow: `0 0 30px ${tier.glow}, 0 0 60px ${tier.glow.replace(/[\d.]+\)$/, '0.1)')}`,
        animation: 'pulseGlow 3s ease-in-out infinite',
        ['--glow-color' as string]: tier.glow,
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <TierBadge tier={tier.name} />
        <span className="font-mono text-xs text-text-dim">{tier.range}</span>
      </div>

      {/* Name + desc */}
      <div>
        <h3 className="font-display font-extrabold text-4xl mb-1" style={{ color: tier.color }}>
          {tier.name}
        </h3>
        {/* Neon line */}
        <div className="h-px w-full my-2" style={{ background: `linear-gradient(90deg, ${tier.color}, transparent)` }} />
        <p className="text-sm text-text-muted">{tier.desc}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-2">
        {tier.stats.map((s) => (
          <span key={s} className="px-2 py-1 rounded-md bg-white/[0.04] text-[10px] text-text-dim font-mono">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TierCards() {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setActive((p) => (p + 1) % tiers.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setActive((p) => (p - 1 + tiers.length) % tiers.length)
  }, [])

  useEffect(() => {
    if (hovered) return
    const iv = setInterval(next, 5000)
    return () => clearInterval(iv)
  }, [hovered, next])

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0, scale: 0.92 }),
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dotted background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Rotating gradient circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123,94,167,0.5) 0%, transparent 70%)',
          animation: 'slowRotate 60s linear infinite',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">Four Tiers of Reputation</h2>
          <p className="text-text-muted">Earn your place in the Etherlink ecosystem</p>
        </motion.div>

        {/* Desktop: stack carousel */}
        <div
          className="hidden md:flex flex-col items-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="relative h-[280px] w-[380px]">
            {/* Background stacked cards */}
            {[2, 1].map((offset) => {
              const idx = (active + offset) % tiers.length
              return (
                <div
                  key={`bg-${offset}`}
                  className="absolute top-0 left-0 w-full transition-all duration-500"
                  style={{
                    transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.05})`,
                    opacity: offset === 1 ? 0.5 : 0.25,
                    zIndex: 10 - offset,
                  }}
                >
                  <TierCard tier={tiers[idx]} />
                </div>
              )
            })}

            {/* Active card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-0 left-0 w-full z-20"
              >
                <TierCard tier={tiers[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent/40 transition-all" aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div className="flex gap-2">
              {tiers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    active === i ? 'bg-accent w-6' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  aria-label={`Go to tier ${i + 1}`}
                />
              ))}
            </div>

            <button onClick={next} className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent/40 transition-all" aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile: horizontal scroll-snap */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 scrollbar-hide">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TierCard tier={tier} isMobile />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {tiers.map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.08); }
        }
        @keyframes slowRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

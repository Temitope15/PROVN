'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  { num: 1, title: 'Connect Your Wallet', desc: 'Enter any wallet address to begin scanning' },
  { num: 2, title: 'AI Scores Your Activity', desc: 'Gemini AI analyzes onchain, GitHub, and DeFi data' },
  { num: 3, title: 'Mint Your Reputation NFT', desc: 'A soulbound NFT is minted to your wallet' },
]

/* ── Step 1: Wallet Connection ─────────────────── */
function Step1Content() {
  const address = '0x4a2f...8e3c'
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const [rows, setRows] = useState([false, false, false])

  useEffect(() => {
    setTyped('')
    setDone(false)
    setRows([false, false, false])
    let i = 0
    const iv = setInterval(() => {
      i++
      if (i <= address.length) {
        setTyped(address.slice(0, i))
      } else if (i === address.length + 3) {
        setDone(true)
      } else if (i === address.length + 6) {
        setRows([true, false, false])
      } else if (i === address.length + 9) {
        setRows([true, true, false])
      } else if (i === address.length + 12) {
        setRows([true, true, true])
      }
    }, 120)
    return () => clearInterval(iv)
  }, [])

  const labels = ['Scanning transactions...', 'Reading onchain history...', 'Fetching DeFi activity...']

  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-accent-bright">
          {typed}
          <span className="animate-pulse">│</span>
        </span>
        {done && (
          <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-green-400 text-xs">
            ✓ Wallet connected
          </motion.span>
        )}
      </div>
      <div className="space-y-2 mt-4">
        {labels.map((label, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + i * 0.4 }}
            className="flex items-center gap-2 text-xs"
          >
            {rows[i] ? (
              <span className="text-green-400">✓</span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            )}
            <span className={rows[i] ? 'text-text-primary' : 'text-text-muted'}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Step 2: AI Scoring ────────────────────────── */
const bars = [
  { label: 'Onchain Activity', pct: 72, color: 'bg-accent' },
  { label: 'GitHub Commits', pct: 58, color: 'bg-accent' },
  { label: 'DeFi Interactions', pct: 35, color: 'bg-cyan' },
  { label: 'Protocol Diversity', pct: 80, color: 'bg-cyan' },
]

function Step2Content() {
  const [showScore, setShowScore] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowScore(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-3 p-1">
      <div className="flex items-center gap-2 text-xs text-accent-bright mb-3">
        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="inline-block">✦</motion.span>
        Gemini AI
      </div>
      {bars.map((b, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">{b.label}</span>
            <motion.span
              className="font-mono text-text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.5 }}
            >
              {b.pct}%
            </motion.span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${b.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${b.pct}%` }}
              transition={{ delay: 0.5 + i * 0.5, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
      <AnimatePresence>
        {showScore && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center pt-3">
            <span className="font-mono text-2xl text-accent-bright">74</span>
            <span className="text-[10px] text-text-dim font-mono">/100</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-1 px-2 py-0.5 rounded-full border border-accent text-accent text-[10px]"
            >
              Contributor
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Step 3: Mint NFT ──────────────────────────── */
function Step3Content() {
  const [scanned, setScanned] = useState(false)
  const [minted, setMinted] = useState(false)
  const txHash = '0x9f3b...c7a1'

  useEffect(() => {
    const t1 = setTimeout(() => setScanned(true), 1200)
    const t2 = setTimeout(() => setMinted(true), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative p-1">
      {/* Floating particles */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-bright"
            style={{
              left: `${15 + i * 14}%`,
              bottom: 0,
              animation: `riseParticle 2.5s ease-out ${i * 0.3}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className={`relative border rounded-xl p-4 overflow-hidden transition-all duration-700 ${
        scanned ? 'border-accent/40 bg-surface-light/50' : 'border-dashed border-white/10 animate-pulse'
      }`}>
        {/* Scan line */}
        {!scanned && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" style={{ animation: 'scanLine 1.2s ease-in-out infinite' }} />
          </div>
        )}

        <AnimatePresence>
          {scanned && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 text-center">
              <p className="font-mono text-xs text-text-muted">0x4a2f...8e3c</p>
              <p className="font-mono text-2xl text-accent-bright">74</p>
              <span className="inline-block px-2 py-0.5 rounded-full border border-accent text-accent text-[10px]">Contributor</span>
              <div className="flex justify-center gap-1.5 pt-1">
                {['Active builder', 'DeFi user'].map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-accent/10 text-accent-bright text-[9px]">✓ {t}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {minted && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-3 text-[10px]">
            <span className="text-green-400">✓</span>
            <span className="text-text-dim">Minted to Etherlink Shadownet</span>
            <span className="font-mono text-text-dim">{txHash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Main Component ────────────────────────────── */
const panels = [Step1Content, Step2Content, Step3Content]

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const [key, setKey] = useState(0)

  const advance = useCallback(() => {
    setActive((p) => (p + 1) % 3)
    setKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const iv = setInterval(advance, 4000)
    return () => clearInterval(iv)
  }, [advance])

  function goTo(i: number) {
    setActive(i)
    setKey((k) => k + 1)
  }

  const ActivePanel = panels[active]

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">How PROVN Works</h2>
          <p className="text-text-muted">Three steps to an onchain reputation</p>
        </motion.div>

        {/* Mobile: pill tabs */}
        <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                active === i ? 'bg-accent text-white' : 'bg-surface-light text-text-muted'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: step navigator (desktop) */}
          <div className="hidden md:flex md:w-[40%] flex-col gap-0 relative">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`text-left p-4 rounded-xl transition-all duration-300 relative ${
                  active === i
                    ? 'bg-accent/5 border-l-2 border-accent'
                    : 'opacity-40 hover:opacity-70 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <motion.span
                    animate={active === i ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.6 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                      active === i ? 'bg-accent text-white shadow-[0_0_16px_rgba(123,94,167,0.4)]' : 'bg-surface-light text-text-dim'
                    }`}
                  >
                    {s.num}
                  </motion.span>
                  <span className={`font-display font-bold text-sm ${active === i ? 'text-text-primary' : 'text-text-muted'}`}>
                    {s.title}
                  </span>
                </div>
                <p className="text-xs text-text-dim ml-10">{s.desc}</p>
                {active === i && (
                  <div className="mt-3 ml-10 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ animation: 'drain 4s linear forwards' }} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right: animated screen */}
          <div className="md:w-[60%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass overflow-hidden"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-[10px] text-text-dim font-mono">provn://oracle</span>
              </div>

              {/* Content */}
              <div className="p-5 min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActivePanel />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes drain {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes riseParticle {
          0% { transform: translateY(0); opacity: 0.8; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}

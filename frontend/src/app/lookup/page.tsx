'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GlowOrb from '@/components/GlowOrb'
import NFTCard from '@/components/NFTCard'
import ExportModal from '@/components/ExportModal'
import { analyzeWallet, AnalyzeResult } from '@/lib/api'
import { useWallet } from '@/context/WalletContext'
import { useSearchParams } from 'next/navigation'
import { Share2, Twitter, Linkedin, Github, Download, ExternalLink, Code } from 'lucide-react'

const loadingMessages = [
  'Scanning Etherlink activity...',
  'Fetching GitHub contributions...',
  'Running AI scoring...',
  'Preparing your results...',
]

type PageState = 'idle' | 'loading' | 'results' | 'error'

export default function LookupPage() {
  const { address: connectedAddress, isConnected } = useWallet()
  const searchParams = useSearchParams()
  const [address, setAddress] = useState('')
  const [github, setGithub] = useState('')
  const [state, setState] = useState<PageState>('idle')
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [toast, setToast] = useState('')
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Auto-fill address if connected or from query param
  useEffect(() => {
    const queryAddress = searchParams.get('address')
    if (queryAddress && state === 'idle') {
      setAddress(queryAddress)
      performAnalysis(queryAddress)
    } else if (isConnected && connectedAddress && !address) {
      setAddress(connectedAddress)
    }
  }, [isConnected, connectedAddress, searchParams])

  useEffect(() => {
    if (state !== 'loading') return
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % loadingMessages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [state])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address.trim()) return
    performAnalysis(address.trim(), github.trim() || undefined)
  }

  async function performAnalysis(addr: string, gh?: string) {
    setState('loading')
    setError('')
    setResult(null)
    setLoadingMsg(0)

    try {
      const data = await analyzeWallet(addr, gh)
      setResult(data)
      setState('results')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }

  function handleReset() {
    setState('idle')
    setResult(null)
    setError('')
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-16 overflow-hidden">
        <GlowOrb color="purple" size={400} top="10%" left="-5%" opacity={0.06} />
        <GlowOrb color="cyan" size={200} bottom="20%" right="5%" opacity={0.05} />

        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">Look Up Any Wallet</h1>
            <p className="text-text-muted">Enter a wallet address to analyze its onchain reputation</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="glass p-6 md:p-8 space-y-4"
              >
                <div>
                  <input
                    id="wallet-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 rounded-lg bg-background border border-white/[0.06] font-mono text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div>
                  <input
                    id="github-username"
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="github username (optional)"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-white/[0.06] text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg bg-accent text-white font-medium hover:brightness-110 glow-purple transition-all"
                >
                  Analyze Wallet
                </motion.button>
                <p className="text-xs text-text-dim text-center">
                  Scores are generated live. First analysis may take 10–15 seconds.
                </p>
              </motion.form>
            )}

            {state === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass p-8 md:p-12 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsg}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-text-muted font-light"
                  >
                    {loadingMessages[loadingMsg]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {state === 'results' && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <NFTCard
                  walletAddress={result.walletAddress}
                  score={result.scoreResult.score}
                  tier={result.scoreResult.tier}
                  justification={result.scoreResult.justification}
                  strengths={result.scoreResult.strengths}
                  stats={{
                    txns: result.onchain.totalTxCount,
                    repos: result.github.totalRepos,
                    defi: result.defi.defiScore,
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass p-5">
                    <h3 className="font-display font-bold text-sm mb-3 text-green-400">Strengths</h3>
                    <ul className="space-y-2">
                      {result.scoreResult.strengths.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                          <span className="text-green-400 text-xs">✓</span>
                          {s}
                        </li>
                      ))}
                      {result.scoreResult.strengths.length === 0 && (
                        <li className="text-sm text-text-dim italic">No strengths identified yet</li>
                      )}
                    </ul>
                  </div>
                  <div className="glass p-5">
                    <h3 className="font-display font-bold text-sm mb-3 text-amber-400">Improvements</h3>
                    <ul className="space-y-2">
                      {result.scoreResult.improvements.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                          <span className="text-amber-400 text-xs">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-lg border border-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
                  >
                    Search Again
                  </motion.button>
                </div>

                {/* SHARE & EXPORT */}
                <div className="glass p-6">
                  <div className="flex items-center gap-2 mb-6 text-accent">
                    <Share2 size={18} />
                    <h3 className="font-display font-bold">Share your Reputation</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const text = `I just got my PROVN reputation score: ${result.scoreResult.score}/100 🛡️\n\nCheck mine out at provn.xyz/lookup/${result.walletAddress}`
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
                      }}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 border border-white/[0.06] hover:bg-white/10 transition-colors"
                    >
                      <Twitter size={16} />
                      <span className="text-sm">X</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const url = `https://provn.xyz/lookup/${result.walletAddress}`
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                      }}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 border border-white/[0.06] hover:bg-white/10 transition-colors"
                    >
                      <Linkedin size={16} />
                      <span className="text-sm">LinkedIn</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/20 border border-accent/20 text-accent hover:bg-accent/30 transition-colors"
                    >
                      <Github size={16} />
                      <span className="text-sm">GitHub</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/20 border border-accent/20 text-accent hover:bg-accent/30 transition-colors"
                    >
                      <Code size={16} />
                      <span className="text-sm">Export</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {result && (
              <ExportModal 
                isOpen={isExportOpen} 
                onClose={() => setIsExportOpen(false)} 
                data={{
                  walletAddress: result.walletAddress,
                  score: result.scoreResult.score,
                  tier: result.scoreResult.tier
                }}
              />
            )}

            {state === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass p-8 text-center border-red-500/20 border"
              >
                <div className="text-red-400 text-3xl mb-3">✕</div>
                <p className="text-text-muted mb-4">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="px-6 py-2 rounded-lg border border-white/[0.06] text-text-muted hover:text-text-primary transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 glass px-4 py-3 text-sm text-accent-bright z-50"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}

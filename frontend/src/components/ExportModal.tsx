'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Copy, Check, Github, Code, ExternalLink } from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    walletAddress: string
    score: number
    tier: string
  }
}

export default function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'badge' | 'react' | 'html'>('badge')
  const [copied, setCopied] = useState(false)

  const githubBadge = `[![Provn Score](https://provn.xyz/api/badge/${data.walletAddress})](https://provn.xyz/lookup/${data.walletAddress})`
  
  const reactSnippet = `import { ProvnScore } from '@provn/react'

export const MyProfile = () => (
  <ProvnScore 
    address="${data.walletAddress}" 
    theme="dark"
  />
)`

  const htmlSnippet = `<div class="provn-widget" data-address="${data.walletAddress}"></div>
<script src="https://provn.xyz/widget.js"></script>`

  const currentSnippet = activeTab === 'badge' ? githubBadge : activeTab === 'react' ? reactSnippet : htmlSnippet

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass p-6 md:p-8 z-[101] border border-white/[0.1]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl">Export Your Score</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            <div className="flex gap-2 p-1 bg-white/5 rounded-lg mb-6">
              {[
                { id: 'badge', label: 'GitHub Badge', icon: Github },
                { id: 'react', label: 'React', icon: Code },
                { id: 'html', label: 'HTML', icon: ExternalLink },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md transition-all ${
                    activeTab === tab.id ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative group">
              <pre className="p-4 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs overflow-x-auto text-accent-bright leading-relaxed max-h-[200px]">
                {currentSnippet}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-accent/20 hover:bg-accent/40 rounded-md border border-accent/30 text-accent transition-all"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <p className="text-xs text-text-dim text-center">
                Your score updates automatically in these components whenever you contribute more onchain or on GitHub.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

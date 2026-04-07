'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/context/WalletContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/lookup', label: 'Lookup' },
  { href: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/[0.06]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-text-primary">
          PROVN<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isConnected && address ? (
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 rounded-lg border border-accent/20 bg-accent/5 text-text-primary text-sm font-mono hover:bg-accent/10 transition-all"
            >
              {formatAddress(address)}
            </button>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-4 py-2 rounded-lg border border-accent text-accent text-sm font-medium hover:bg-accent-glow hover:shadow-[0_0_20px_rgba(123,94,167,0.3)] transition-all duration-300 disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-muted"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-xl border-b border-white/[0.06]"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-text-muted hover:text-text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              {isConnected && address ? (
                <button
                  onClick={disconnectWallet}
                  className="w-full mt-2 px-4 py-2 rounded-lg border border-accent/20 bg-accent/5 text-text-primary text-sm font-mono"
                >
                  {formatAddress(address)}
                </button>
              ) : (
                <button
                  onClick={() => {
                    connectWallet()
                    setMobileOpen(false)
                  }}
                  disabled={isConnecting}
                  className="w-full mt-2 px-4 py-2 rounded-lg border border-accent text-accent text-sm font-medium hover:bg-accent-glow transition-all disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

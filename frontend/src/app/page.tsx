'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GlowOrb from '@/components/GlowOrb'
import ScoreRing from '@/components/ScoreRing'
import TierBadge from '@/components/TierBadge'
import Footer from '@/components/Footer'
import HowItWorks from '@/components/HowItWorks'
import TierCards from '@/components/TierCards'
import Marquee from '@/components/Marquee'
import BentoGrid, { BentoItem } from '@/components/BentoGrid'
import { Shield, Zap, Code, Globe, UserCheck, Layers, Share2, Award } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}



const stats = [
  { top: 'Soulbound', bottom: 'Cannot be transferred' },
  { top: 'AI-Powered', bottom: 'Scored by AI' },
  { top: '3 Sources', bottom: 'Onchain + GitHub + DeFi' },
  { top: 'Live Onchain', bottom: 'Updates anytime' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <GlowOrb color="purple" size={600} top="-10%" left="-5%" opacity={0.12} />
        <GlowOrb color="cyan" size={250} top="5%" right="10%" opacity={0.08} />
        <GlowOrb color="purple" size={400} bottom="5%" left="40%" opacity={0.08} />

        {/* Magic UI Dotted Grid Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '32px 32px' 
          }} 
        />
        
        <div
          className="absolute inset-0 opacity-[0.04] z-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.15) 80px, rgba(255,255,255,0.15) 81px)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-32 pb-16">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-display text-accent-bright">
              ⬡ Built on Tezos EVM
            </span>
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show" className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl leading-tight mb-6">
            <span className="glassy-text">Your Contribution.</span><br />
            <span className="vivid-purple-glow">Proven Onchain.</span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show" className="font-light text-text-muted text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            PROVN mints a living, soulbound reputation NFT that grows with your onchain and GitHub contributions. No resumes. No gatekeepers. Just proof.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/lookup">
              <motion.button
                whileHover={{ scale: 1.03, filter: 'brightness(1.15)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-lg bg-accent text-white font-medium glow-purple transition-all"
              >
                Check Your Score
              </motion.button>
            </Link>
            <a href="#how-it-works">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-lg border border-accent text-accent hover:bg-accent-glow transition-all"
              >
                How It Works
              </motion.button>
            </a>
          </motion.div>

          {/* Floating mock card */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="animate-float"
          >
            <div className="gradient-border p-6 max-w-xs mx-auto relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-8 bg-accent/20 blur-2xl rounded-full" />
              <p className="font-mono text-xs text-text-muted mb-4">0x4a2f...8e3c</p>
              <div className="flex justify-center mb-3">
                <ScoreRing score={74} size={120} />
              </div>
              <div className="flex justify-center">
                <TierBadge tier="Contributor" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM MARQUEE */}
      <section className="py-12 border-y border-white/[0.04] bg-background/50 backdrop-blur-sm overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim font-bold">Powering Digital Identity Across</p>
        </div>
        <Marquee speed={60} className="mb-8">
          {[
            'Tezos EVM', 'GitHub', 'Aave', 'Uniswap', 'Gitcoin', 'Snapshot', 'Lens Protocol', 'Farcaster'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-8 py-2 rounded-xl bg-white/5 border border-white/[0.05] text-text-muted font-display text-lg whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-accent" />
              {item}
            </div>
          ))}
        </Marquee>
        <Marquee speed={50} direction="right">
          {[
            'Open Source', 'DeFi Governance', 'Social Graph', 'Onchain Reputation', 'Soulbound Tokens', 'AI Verification'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-8 py-2 rounded-xl bg-accent/5 border border-accent/10 text-accent/80 font-display text-lg whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-accent-bright" />
              {item}
            </div>
          ))}
        </Marquee>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">Programmable Reputation.</h2>
          <p className="text-text-muted max-w-xl mx-auto">Our AI engine aggregates multidimensional data to create a definitive trust score.</p>
        </div>

        <BentoGrid>
          <BentoItem
            title="Soulbound NFT"
            description="Your reputation is non-transferable. It's truly yours, tied to your unique identity and work history."
            icon={<Shield size={20} />}
            className="md:col-span-2"
            graphic={
              <div className="flex gap-4 items-end justify-center w-full">
                {[40, 70, 55].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: h }}
                    className="w-12 bg-accent/20 rounded-t-lg border border-accent/30 relative"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent">{h}</div>
                  </motion.div>
                ))}
              </div>
            }
          />
          <BentoItem
            title="Real-time Scoring"
            description="Connect your wallet and GitHub to see your score update instantly based on your latest activity."
            icon={<Zap size={20} />}
          />
          <BentoItem
            title="Developer Focus"
            description="Deep integration with GitHub to analyze commits, PRs, and stars. We reward builders."
            icon={<Code size={20} />}
          />
          <BentoItem
            title="Multichain Data"
            description="Currently on Tezos, expanding to more chains soon. We see the whole ecosystem."
            icon={<Globe size={20} />}
            className="md:col-span-2"
            graphic={
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border border-dashed border-accent/30 animate-spin-slow" />
                <div className="absolute w-40 h-40 rounded-full border border-dashed border-white/10 animate-spin-reverse-slow" />
                <div className="w-12 h-12 rounded-full bg-accent/30 blur-xl" />
              </div>
            }
          />
        </BentoGrid>
      </section>

      {/* STATS BAR */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="bg-surface py-10"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} variants={slideUp} className="text-center">
              <div className="font-display font-bold text-lg text-accent">{s.top}</div>
              <div className="text-xs text-text-muted mt-1">{s.bottom}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* TIER SHOWCASE */}
      <TierCards />

      {/* CTA BANNER */}
      <section className="relative py-28 overflow-hidden">
        <GlowOrb color="purple" size={400} top="20%" left="50%" opacity={0.1} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 text-center px-6"
        >
          <motion.h2 variants={slideUp} className="font-display font-bold text-3xl md:text-4xl mb-4">
            Start Building Your Reputation
          </motion.h2>
          <motion.p variants={slideUp} className="text-text-muted mb-8 max-w-md mx-auto">
            Your contributions already matter. Now prove it.
          </motion.p>
          <motion.div variants={slideUp}>
            <Link href="/lookup">
              <motion.button
                whileHover={{ scale: 1.03, filter: 'brightness(1.15)' }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-lg bg-accent text-white font-display font-bold text-lg glow-purple transition-all"
              >
                Get Your PROVN Score
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}

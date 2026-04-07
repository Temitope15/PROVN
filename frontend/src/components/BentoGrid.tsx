'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BentoItemProps {
  title: string
  description: string
  icon: ReactNode
  className?: string
  graphic?: ReactNode
}

export function BentoItem({ title, description, icon, className = '', graphic }: BentoItemProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass group relative overflow-hidden p-6 flex flex-col justify-between h-full border border-white/[0.06] hover:border-accent/40 transition-all ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div>
        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          {icon}
        </div>
        <h3 className="font-display font-bold text-lg mb-2 text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </div>

      {graphic && (
        <div className="mt-6 relative flex items-center justify-center min-h-[120px]">
          {graphic}
        </div>
      )}
    </motion.div>
  )
}

export default function BentoGrid({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  )
}

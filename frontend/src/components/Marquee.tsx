'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  direction?: 'left' | 'right'
  speed?: number
  className?: string
}

export default function Marquee({
  children,
  direction = 'left',
  speed = 40,
  className = '',
}: MarqueeProps) {
  const isRight = direction === 'right'

  return (
    <div className={`flex w-full overflow-hidden select-none gap-8 ${className}`}>
      <motion.div
        animate={{
          x: isRight ? [ '-50%', '0%' ] : [ '0%', '-50%' ],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex flex-none gap-8 items-center"
      >
        {/* Render children twice for infinite loop */}
        {children}
        {children}
      </motion.div>
    </div>
  )
}

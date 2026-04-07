import { WalletProvider } from '@/context/WalletContext'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PROVN — Reputation NFT Oracle',
  description: 'Your work, proven onchain. Mint a living reputation NFT that grows with your contributions on Etherlink.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-text-primary antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}

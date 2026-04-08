'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  chainName: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainName, setChainName] = useState<string | null>(null)

  const getEthereum = () => {
    if (typeof window !== 'undefined') return (window as any).ethereum
    return null
  }

  const checkConnection = useCallback(async () => {
    const ethereum = getEthereum()
    if (!ethereum) return

    try {
      // eth_accounts is passive — it never triggers a MetaMask popup
      const accounts: string[] = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)

        try {
          const chainId: string = await ethereum.request({ method: 'eth_chainId' })
          setChainName(`Chain ${parseInt(chainId, 16)}`)
        } catch {
          setChainName(null)
        }
      }
    } catch (err) {
      console.warn('Silent connection check skipped:', err)
    }
  }, [])

  useEffect(() => {
    checkConnection()

    const ethereum = getEthereum()
    if (!ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      } else {
        setAddress(null)
        setIsConnected(false)
        setChainName(null)
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
      ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [checkConnection])

  const connectWallet = async () => {
    const ethereum = getEthereum()
    if (!ethereum) {
      alert('Please install MetaMask or another Web3 wallet.')
      return
    }

    setIsConnecting(true)
    try {
      const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)

        try {
          const chainId: string = await ethereum.request({ method: 'eth_chainId' })
          setChainName(`Chain ${parseInt(chainId, 16)}`)
        } catch {
          setChainName(null)
        }
      }
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected — do nothing, don't spam alerts
      } else if (error.code === -32002) {
        alert('A connection request is already pending. Please open MetaMask and approve or reject it.')
      } else {
        console.error('Wallet connection error:', error)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    setChainName(null)
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        chainName,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

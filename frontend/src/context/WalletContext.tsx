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

  const checkConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        
        // Timeout for account listing
        const accountsPromise = provider.listAccounts()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection check timed out')), 3000)
        )

        const accounts = await Promise.race([accountsPromise, timeoutPromise]) as any[]
        
        if (accounts.length > 0) {
          const addr = accounts[0].address
          setAddress(addr)
          setIsConnected(true)
          
          try {
            const network = await provider.getNetwork()
            setChainName(network.name)
          } catch (netErr) {
            console.warn('Network check failed during auto-connect:', netErr)
          }
        }
      } catch (error) {
        console.warn('Silent connection check failed:', error)
      }
    }
  }, [])

  useEffect(() => {
    checkConnection()

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      ;(window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        } else {
          setAddress(null)
          setIsConnected(false)
        }
      })

      ;(window as any).ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [checkConnection])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setIsConnecting(true)
      try {
        console.log('Initiating wallet connection...')
        // Using request directly as it's often more responsive than ethers wrapper for initial popup
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        
        if (accounts && accounts.length > 0) {
          const addr = accounts[0]
          setAddress(addr)
          setIsConnected(true)
          
          const provider = new ethers.BrowserProvider((window as any).ethereum)
          
          // Add a timeout to getNetwork to prevent hanging if the network is slow/unresponsive
          const networkPromise = provider.getNetwork()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network detection timed out')), 5000)
          )

          try {
            const network = await Promise.race([networkPromise, timeoutPromise]) as ethers.Network
            setChainName(network.name)
            console.log('Connected to network:', network.name)
          } catch (netError) {
            console.warn('Network detection failed or timed out:', netError)
            setChainName('Unknown Network')
          }
        }
      } catch (error: any) {
        console.error('Error connecting wallet:', error)
        if (error.code === 4001) {
          alert('Connection request rejected by user.')
        } else if (error.code === -32002) {
          alert('Request already pending in MetaMask. Please open your wallet extension.')
        } else {
          alert(`Connection failed: ${error.message || 'Unknown error'}`)
        }
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet.')
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

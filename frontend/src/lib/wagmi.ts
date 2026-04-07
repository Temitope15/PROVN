import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Basic wagmi config for etherlinkShadownet network
const etherlinkShadownet = {
  id: 128123,
  name: 'Etherlink Shadownet',
  nativeCurrency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://node.ghostnet.etherlink.com'] },
  },
} as const

export const config = createConfig({
  chains: [mainnet, sepolia, etherlinkShadownet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [etherlinkShadownet.id]: http(),
  },
})

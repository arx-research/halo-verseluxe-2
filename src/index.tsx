import React from 'react'
import ReactDOM from 'react-dom/client'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, useAccount, useNetwork, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import Router from './components/Router'
import { WC_PROJECT } from './constants'

// Configure wallet connect
const chains = [mainnet]
const projectId = WC_PROJECT

// Wagmi client
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  // @ts-ignore
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

// Render app
const root = ReactDOM.createRoot(document.querySelector('#application')!)

root.render(
  <>
    <WagmiConfig config={wagmiConfig}>
      <Router />
    </WagmiConfig>
    <Web3Modal
      explorerExcludedWalletIds={['fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa']}
      projectId={projectId}
      ethereumClient={ethereumClient}
    />
  </>
)

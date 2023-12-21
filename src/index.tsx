import React from 'react'
import ReactDOM from 'react-dom/client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { mainnet } from 'viem/chains'
import Router from './components/Router'
import { WC_PROJECT } from './constants'

const metadata = {
  name: 'Verseluxe',
  description: '',
  url: 'Verseluxe',
  icons: [''],
}

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId: WC_PROJECT, metadata })

createWeb3Modal({ wagmiConfig, projectId: WC_PROJECT, chains })

// Render app
const root = ReactDOM.createRoot(document.querySelector('#application')!)

root.render(
  <>
    <WagmiConfig config={wagmiConfig}>
      <Router />
    </WagmiConfig>
  </>
)

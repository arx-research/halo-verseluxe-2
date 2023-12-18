import React from 'react'
import applicationStore from '../stores/applicationStore'
import HeaderConnect from './HeaderConnect'
import HeaderWallet from './HeaderWallet'

import { useAccount, useNetwork } from 'wagmi'

export default function Header() {
  const settings = (window as any).HALO_SETTINGS
  const { address, isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()
  const disconnect = applicationStore((s) => s.walletDisconnect)
  const connect = applicationStore((s) => s.walletConnect)

  React.useEffect(() => {
    if (isConnected && address) {
      connect(address, chain?.id || 1)
    }

    if (isDisconnected) {
      disconnect()
    }
  }, [address, isConnected, isDisconnected])

  return (
    <header className="header">
      <img src={settings.logo} alt="logo" />
      {isConnected ? <HeaderWallet /> : <HeaderConnect />} {}
    </header>
  )
}

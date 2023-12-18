import React, { useEffect } from 'react'
import Viewer from '../pages/Viewer'
import Scan from '../pages/Scan'
import applicationStore from '../stores/applicationStore'
import Loading from './Loading'
import Settings from './Settings'
import { useAccount, useNetwork } from 'wagmi'

export default function Router() {
  const { address, isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()
  const s = applicationStore()

  useEffect(() => {
    s.deviceInit()
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      s.walletConnect(address, chain?.id || 1)
    }

    if (isDisconnected) {
      s.walletDisconnect()
    }

    s.walletSetReady()
  }, [address, isConnected, isDisconnected])

  return (
    <>
      <Settings />
      {s.loading && <Loading />}
      {!s.loading && s.device.node_id && <Viewer />}
      {!s.loading && !s.device.node_id && <Scan />}
    </>
  )
}

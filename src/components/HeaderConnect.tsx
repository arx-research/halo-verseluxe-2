import { useWeb3Modal } from '@web3modal/wagmi/react'
import React from 'react'

export default function HeaderConnect() {
  const { open } = useWeb3Modal()

  return (
    <button className="header-connect" onClick={() => open()}>
      Connect wallet
    </button>
  )
}

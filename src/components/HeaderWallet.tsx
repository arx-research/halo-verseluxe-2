import React from 'react'
import classNames from 'classnames'

import applicationStore from '../stores/applicationStore'
import truncateAddress from '../helpers/truncate-address'
import ChevronUp from '../svg/ChevronUp'
import { useAccount, useDisconnect } from 'wagmi'

export default function HeaderWallet() {
  const { address } = useAccount()
  const setActive = applicationStore((s) => s.walletSetDropdownActive)
  const { disconnect } = useDisconnect()
  const active = applicationStore((s) => s.walletDropdownActive)
  const truncatedAddress = truncateAddress(address)

  return (
    <div className={classNames('wallet-dropdown-wrap', { active })} onClick={() => setActive(false)}>
      <div className="header-wallet-dropdown-overlay"></div>
      <div className="header-wallet-dropdown" onClick={(e) => e.stopPropagation()}>
        <button
          className="header-wallet-button"
          onClick={(e) => {
            e.stopPropagation()
            setActive(!active)
          }}
        >
          {truncatedAddress}
          <ChevronUp />
        </button>

        <div className="header-wallet-dropdown-dropdown">
          <span className="header-wallet-dropdown-wallet-link">
            <span className="header-wallet-dropdown-wallet-link-indicator"></span>
            <span className="header-wallet-dropdown-wallet-link-address">{truncatedAddress}</span>
          </span>
          <button onClick={() => disconnect()} className="header-wallet-dropdown-wallet-disconnect">
            Disconnect
          </button>
        </div>
      </div>
    </div>
  )
}

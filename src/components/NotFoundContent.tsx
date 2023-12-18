import React from 'react'
import { ARWEAVE_NODE } from '../constants'
import { getChainData } from '../helpers/get-chain-data'
import truncateAddress from '../helpers/truncate-address'
import applicationStore from '../stores/applicationStore'
import Card from './Card'
import CardPadding from './CardPadding'

export default function NotFoundContent() {
  const triggerScan = applicationStore((s) => s.deviceTriggerScan)

  return (
    <Card>
      <CardPadding>
        <h1 className="not-found-content-heading">No Halo</h1>
        <p className="not-found-content-body">
          Scan chip by tapping the button below and holding the chip to your smartphone NFC antenna
        </p>
        <button onClick={triggerScan} className="not-found-content-scan">
          SCAN
        </button>
      </CardPadding>
    </Card>
  )
}

import React from 'react'
import { ARWEAVE_NODE } from '../constants'
import { getChainData } from '../helpers/get-chain-data'
import truncateAddress from '../helpers/truncate-address'
import applicationStore from '../stores/applicationStore'
import Card from './Card'
import CardPadding from './CardPadding'
import ContentDetail from './ContentDetail'
import Divider from './Divider'
import { marked } from 'marked'

export default function Content() {
  const device = applicationStore((s) => s.device)
  const keys = applicationStore((s) => s.deviceKeys)
  const meta = JSON.parse(device.device_token_metadata)
  const chainId = applicationStore((s) => s.walletChainId)

  const explorer = getChainData(chainId).explorer
  const isVideo = device.content_type.indexOf('video') > -1

  return (
    <Card>
      {isVideo ? (
        <video className="card-video" autoPlay loop playsInline muted>
          <source src={`${ARWEAVE_NODE}/${device.node_id}`} />
        </video>
      ) : (
        <img src={`${ARWEAVE_NODE}/${device.node_id}`} />
      )}

      <CardPadding>
        <h1 className="content-heading">{meta.name}</h1>
        <p className="content-meta">
          Created by{' '}
          <a target="_blank" href={`${explorer}/${device.device_minter}`}>
            {truncateAddress(device.device_minter)}
          </a>
        </p>
        <div className="content-description" dangerouslySetInnerHTML={{ __html: marked(meta.description) }} />

        <button className="content-special-button">Claim</button>

        <button disabled className="content-special-button content-special-button--loading">
          Claiming...
        </button>

        <button disabled className="content-special-button">
          Claimed
        </button>

        <Divider />

        <ContentDetail title="Device ID">{keys.primaryPublicKeyHash}</ContentDetail>
      </CardPadding>
    </Card>
  )
}

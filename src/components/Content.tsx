import React, { useState } from 'react'
import { ARWEAVE_NODE } from '../constants'
import { getChainData } from '../helpers/get-chain-data'
import truncateAddress from '../helpers/truncate-address'
import applicationStore from '../stores/applicationStore'
import Card from './Card'
import CardPadding from './CardPadding'
import ContentDetail from './ContentDetail'
import Divider from './Divider'
import { marked } from 'marked'
import classNames from 'classnames'

export default function Content() {
  const device = applicationStore((s) => s.device)
  const keys = applicationStore((s) => s.deviceKeys)
  const meta = JSON.parse(device.device_token_metadata)
  const chainId = applicationStore((s) => s.walletChainId)

  const explorer = getChainData(chainId).explorer
  const isVideo = device.content_type.indexOf('video') > -1

  const [status, setStatus] = useState(0)

  const buttonClick = () => {
    setStatus(1)

    setTimeout(() => {
      setStatus(2)
    }, 1000)
  }

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

        <button
          onClick={buttonClick}
          disabled={status > 0}
          className={classNames('content-special-button', {
            'content-special-button--pending': status === 1,
            'content-special-button--claimed': status === 2,
          })}
        >
          <div className="content-special-button__claimed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="17">
              <path fill="currentColor" d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" />
            </svg>
          </div>
          <svg className="content-special-button__spinner" viewBox="0 0 20 20">
            <path
              d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="content-special-button__text">
            {status === 0 && <>Claim</>}
            {status === 1 && <>Pending</>}
            {status === 2 && <>Claimed</>}
          </span>
        </button>

        <Divider />

        <ContentDetail title="Device ID">{keys.primaryPublicKeyHash}</ContentDetail>
      </CardPadding>
    </Card>
  )
}

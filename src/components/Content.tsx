import React, { useEffect, useState } from 'react'
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

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import hashMessageEIP191SolidityKeccak from '../helpers/hash-message'
import { useAccount } from 'wagmi'

export default function Content() {
  const s = applicationStore()
  const meta = JSON.parse(s.device.device_token_metadata)
  const explorer = getChainData(s.walletChainId).explorer
  const isVideo = s.device.content_type.indexOf('video') > -1

  const [status, setStatus] = useState(0)

  const buttonClick = async () => {
    try {
      setStatus(1)
      await s.claim()
      setStatus(2)
    } catch (err) {
      console.log('Failed to claim', err)
      setStatus(0)
    }
  }

  useEffect(() => {
    s.checkClaimed()
  }, [s.walletAddress, s.walletClient])

  return (
    <Card>
      {isVideo ? (
        <video className="card-video" autoPlay loop playsInline muted>
          <source src={`${ARWEAVE_NODE}/${s.device.node_id}`} />
        </video>
      ) : (
        <img src={`${ARWEAVE_NODE}/${s.device.node_id}`} />
      )}

      <CardPadding>
        <h1 className="content-heading">{meta.name}</h1>
        <p className="content-meta">
          Created by{' '}
          <a target="_blank" href={`${explorer}/${s.device.device_minter}`}>
            {truncateAddress(s.device.device_minter)}
          </a>
        </p>
        <div className="content-description" dangerouslySetInnerHTML={{ __html: marked(meta.description) }} />

        {s.hasClaimable && (
          <>
            <button
              onClick={buttonClick}
              disabled={s.isClaimed !== false || status > 0 || !s.walletConnected}
              className={classNames('content-special-button', {
                'content-special-button--no-wallet':
                  (!s.walletConnected && s.isClaimed !== true) || s.isClaimed === undefined,
                'content-special-button--pending': status === 1,
                'content-special-button--claimed': status === 2 || s.isClaimed,
              })}
            >
              {s.isClaimed === undefined && <span className="content-special-button__text">Checking...</span>}
              {s.isClaimed !== undefined && (
                <>
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
                    {!s.isClaimed && !s.walletConnected && <>Connect wallet to claim</>}
                    {!s.isClaimed && s.walletConnected && status === 0 && <>Claim</>}
                    {!s.isClaimed && s.walletConnected && status === 1 && <>Pending</>}
                    {!s.isClaimed && s.walletConnected && status === 2 && <>Claimed</>}
                    {s.isClaimed && <>Claimed</>}
                  </span>
                </>
              )}
            </button>
          </>
        )}

        <Divider />

        <ContentDetail title="Device ID">{s.deviceKeys.primaryPublicKeyHash}</ContentDetail>
      </CardPadding>
    </Card>
  )
}

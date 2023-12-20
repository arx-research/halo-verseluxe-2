import { create } from 'zustand'
import axios from 'axios'
import URL from 'url-parse'
import parseKeys from '../helpers/parse-keys'
import { IDevice, IKeys } from '../types'
import generateArweaveQuery from '../helpers/generate-arweave-query'
import { ARWEAVE_GRAPHQL, TAG_DOMAIN } from '../constants'
import safeTag from '../helpers/safe-tag'

import { execHaloCmdWeb } from '@arx-research/libhalo/api/web.js'
import parseKeysNew from '../helpers/parse-keys-new'
import {
  EIP1193Provider,
  createPublicClient,
  createWalletClient,
  custom,
  encodeAbiParameters,
  http,
  parseAbi,
} from 'viem'
import { mainnet } from 'wagmi'
import hashMessageEIP191SolidityKeccak from '../helpers/hash-message'
import { wagmiAbi } from '../wagmiAbi'

type TApplicationStore = {
  // Global stuff
  loading: boolean

  // Wallet stuff
  walletConnected: boolean
  walletReady: boolean
  walletAddress: string
  walletChainId: number
  walletDropdownActive: boolean
  walletSetDropdownActive(dropdownActive: boolean): void
  walletDisconnect(): void
  walletConnect(address: string, chainId: number): void
  walletSetReady(): void

  // Device stuff
  device: IDevice
  deviceKeys: IKeys
  deviceInit(): void
  deviceRetrieve(): void
  deviceTriggerScan(): void

  // Claim stuff
  publicClient: any
  walletClient: any
  claim(): void
}

const applicationStore = create<TApplicationStore>((set, get) => ({
  /*
    Global
  */

  loading: true,

  /*
    Wallet
  */

  walletAddress: '',
  walletChainId: 1,
  walletReady: false,
  walletDropdownActive: false,
  walletConnected: false,

  walletConnect: (walletAddress, walletChainId) => {
    set({ walletAddress, walletChainId, walletConnected: true })
  },

  walletDisconnect: async () => {
    set({ walletAddress: '', walletChainId: 1, walletConnected: false })
  },

  walletSetReady: () => {
    set({ walletReady: true })
  },

  walletSetDropdownActive: (walletDropdownActive) => {
    set({ walletDropdownActive })
  },

  /*
    Devise
  */

  device: {
    node_id: '',
    app_name: '',
    app_version: '',
    content_type: '',
    device_record_type: '',
    device_id: '',
    device_token_metadata: '',
    device_address: '',
    device_manufacturer: '',
    device_model: '',
    device_merkel_root: '',
    device_minter: '',
    device_registry: '',
    ifps_add: '',
    chain_id: '',
  },

  deviceKeys: {
    primaryPublicKeyHash: '',
    primaryPublicKeyRaw: '',
    secondaryPublicKeyHash: '',
    secondaryPublicKeyRaw: '',
    tertiaryPublicKeyHash: '',
    tertiaryPublicKeyRaw: '',
  },

  deviceInit: () => {
    // Parse url
    const url = new URL(window.location.href, true)

    if (url.query.static) {
      // Parse keys
      const deviceKeys = parseKeys(url.query.static)

      // If keys exist
      if (deviceKeys !== false) {
        set({ deviceKeys })
        applicationStore.getState().deviceRetrieve()
      } else {
        set({ loading: false })
      }
    } else {
      set({ loading: false })
    }
  },

  deviceRetrieve: () => {
    // Generate a query
    const { deviceKeys } = applicationStore.getState()
    const query = generateArweaveQuery(deviceKeys)

    // Fetch device data
    axios
      .post(ARWEAVE_GRAPHQL, { query })
      .then(async (res) => {
        // Extract transactions
        const transactions = res.data.data.transactions.edges

        // Find the media index
        const transactionIndex = transactions.findIndex((t: any) => {
          const tag = t.node.tags.find((tag: any) => {
            return tag.name === 'Device-Record-Type'
          })

          if (tag && tag.value === 'Device-Media') {
            return true
          }
        })

        // If no index use 0
        const tIndex = transactionIndex > -1 ? transactionIndex : 0

        // Create a device object from the first record
        const mapped = [transactions[tIndex || 0]].flatMap((nodeItem: any) => {
          const node = nodeItem.node

          return {
            node_id: node.id,
            app_name: safeTag(node, 'App-Name', null),
            app_version: safeTag(node, 'App-Version', null),
            content_type: safeTag(node, 'Content-Type', null),
            device_record_type: safeTag(node, 'Device-Record-Type', null),
            device_id: safeTag(node, 'Device-Id', null),
            device_address: safeTag(node, 'Device-Address', null),
            device_manufacturer: safeTag(node, 'Device-Manufacturer', null),
            device_model: safeTag(node, 'Device-Model', null),
            device_merkel_root: safeTag(node, 'Device-Merkel-Root', null),
            device_registry: safeTag(node, 'Device-Registry', null),
            ifps_add: safeTag(node, 'IPFS-Add', null),
            device_token_metadata: safeTag(node, 'Device-Token-Metadata', null),
            device_minter: safeTag(node, 'Device-Minter', null),
            chain_id: safeTag(node, 'Device-Minter-Chain-Id', null),
          }
        })

        set({ device: mapped[0], loading: false })
      })
      .catch((err) => {
        set({ loading: false })
      })
  },

  deviceTriggerScan: async () => {
    try {
      // @ts-ignore
      const res = await execHaloCmdWeb({ name: 'get_pkeys' })
      const deviceKeys = parseKeysNew(res.publicKeys)

      if (deviceKeys) {
        set({ deviceKeys })
        applicationStore.getState().deviceRetrieve()
      }
    } catch (err) {
      console.log('in heree')
    }
  },

  /* 
    Claim
  */

  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),

  walletClient: createWalletClient({
    chain: mainnet,
    transport: http(),
  }),

  claim: async () => {
    // Make sure we have needed stuff
    const { publicClient, walletAddress, walletClient } = get()
    if (!publicClient || walletAddress === '' || !walletClient) return

    // Get most recent hash
    const block = await publicClient.getBlock({ blockTag: 'latest' })
    if (!block.hash) return

    // Create a message with both
    const digest = hashMessageEIP191SolidityKeccak(walletAddress, block.hash)

    // Have libhalo sign it
    const res = await execHaloCmdWeb({
      name: 'sign',
      keyNo: 1,
      digest: digest.slice(2),
    })

    // Get account address

    // const [account] = await walletClient.getAddresses()
    // console.log({ account })
    const noopProvider = { request: () => null } as unknown as EIP1193Provider
    const provider = typeof window !== 'undefined' ? (window as any).ethereum! : noopProvider
    const client = createWalletClient({
      chain: mainnet,
      transport: custom(provider),
    })

    // Do it
    const result = await publicClient.simulateContract({
      address: '0x8E54564436157FA91Dfb43a75c10aD5BE137ff7f',
      abi: [
        {
          inputs: [
            { internalType: 'bytes', name: 'signatureFromChip', type: 'bytes' },
            { internalType: 'uint256', name: 'blockNumberUsedInSig', type: 'uint256' },
          ],
          name: 'mintOrTransferTokenWithChip',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      args: [res.signature.ether, block.number],
      functionName: 'mintOrTransferTokenWithChip',
      account: walletAddress,
    })

    const hash = await client.writeContract(result.request)

    console.log({ hash, result })
  },
}))

export default applicationStore

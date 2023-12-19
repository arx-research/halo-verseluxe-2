import { create } from 'zustand'
import axios from 'axios'
import URL from 'url-parse'
import parseKeys from '../helpers/parse-keys'
import { IDevice, IKeys } from '../types'
import generateArweaveQuery from '../helpers/generate-arweave-query'
import { ARWEAVE_GRAPHQL, TAG_DOMAIN } from '../constants'
import safeTag from '../helpers/safe-tag'
import fromHexString from '../helpers/from-hex-string'
import buf2hex from '../helpers/buff-to-hex'

import {
  haloGetDefaultMethod,
  execHaloCmdWeb,
  haloFindBridge,
  haloCheckWebNFCPermission,
} from '@arx-research/libhalo/api/web.js'
import parseKeysNew from '../helpers/parse-keys-new'

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
}

const applicationStore = create<TApplicationStore>((set) => ({
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
}))

export default applicationStore

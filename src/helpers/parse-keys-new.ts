import { ethers } from 'ethers'

type PublicKeys = {
  1: string | undefined
  2: string | undefined
  3: string | undefined
}

export default function parseKeysNew(publicKeys: PublicKeys) {
  try {
    let primaryPublicKeyHash = ''

    if (publicKeys[1]) {
      primaryPublicKeyHash = ethers.utils.sha256('0x' + publicKeys[1].slice(2))
    }

    let secondaryPublicKeyHash = ''

    if (publicKeys[2]) {
      secondaryPublicKeyHash = ethers.utils.sha256('0x' + publicKeys[2].slice(2))
    }

    let tertiaryPublicKeyHash = ''

    if (publicKeys[3]) {
      tertiaryPublicKeyHash = ethers.utils.sha256('0x' + publicKeys[3].slice(2))
    }

    const keys = {
      primaryPublicKeyHash: primaryPublicKeyHash,
      primaryPublicKeyRaw: publicKeys[1] || '',
      secondaryPublicKeyHash: secondaryPublicKeyHash,
      secondaryPublicKeyRaw: publicKeys[2] || '',
      tertiaryPublicKeyHash: tertiaryPublicKeyHash,
      tertiaryPublicKeyRaw: publicKeys[3] || '',
    }

    return keys
  } catch (err) {
    return false
  }
}

export const wagmiAbi = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signatureFromChip',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'blockNumberUsedInSig',
        type: 'uint256',
      },
    ],
    name: 'mintOrTransferTokenWithChip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

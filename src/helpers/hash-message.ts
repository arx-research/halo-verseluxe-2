import { arrayify, solidityKeccak256 } from 'ethers/lib/utils'

export default function hashMessageEIP191SolidityKeccak(address: string, hash: string) {
  const messagePrefix = '\x19Ethereum Signed Message:\n32'
  const message = address
    ? solidityKeccak256(['address', 'bytes32'], [address, hash])
    : solidityKeccak256(['bytes32'], [hash])
  return solidityKeccak256(['string', 'bytes32'], [messagePrefix, arrayify(message)])
}

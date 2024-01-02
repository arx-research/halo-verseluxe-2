export default function makeStatic(pk1, pk2, pk3) {
  let out = '41' + pk1

  if (pk2) {
    out += '41' + pk2
  } else {
    out += '00'.repeat(66)
  }

  if (pk2 && pk3) {
    out += '41' + pk3
  } else {
    out += '00'.repeat(66)
  }

  return out
}

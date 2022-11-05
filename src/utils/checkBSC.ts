export function isBSC(chainId: number | undefined) {
  return chainId === 97 || chainId == 56 ? true : false
}

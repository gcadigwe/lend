export type TokenMap = {
  [key: string]: Array<{
    chainId: number
    tokenAddress: string
  }>
}
export const tokensMap: TokenMap = {
  SPHRI: [
    {
      chainId: 1,
      tokenAddress: '0x8A0cdfaB62eD35b836DC0633482798421C81b3Ec'
    },
    {
      chainId: 56,
      tokenAddress: '0x8EA93D00Cc6252E2bD02A34782487EEd65738152'
    },
    {
      chainId: 137,
      tokenAddress: '0x2fD4D793c1905D82018d75e3b09d3035856890a1'
    },
    {
      chainId: 43114,
      tokenAddress: '0x2fD4D793c1905D82018d75e3b09d3035856890a1'
    }
  ],
  BACD2: [
    {
      chainId: 1,
      tokenAddress: '0x66eb10c9B80fC52401384285f5Ecc18C0b924bBd'
    },
    {
      chainId: 56,
      tokenAddress: '0xc96Ebbc3b3158aAb69312e89fe04C9Cd192BeE01'
    }
  ]
}

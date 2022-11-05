import { WETH, AVAX, MATIC } from '@spherium/swap-sdk'

export type TokenConfig = {
  chainId?: string
  address: string
  decimals: number
  name?: string
  symbol?: string
  imageUri?: string
  resourceId: string
  isNativeWrappedToken?: boolean
  assetBase: string
}

export type BridgeConfig = {
  chainId: number
  networkId: number
  name: string
  bridgeAddress: string
  erc20HandlerAddress: string
  rpcUrl: string
  gasLimit?: number
  type: 'Ethereum' | 'Substrate'
  tokens: TokenConfig[]
  nativeTokenSymbol: string
  //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
  blockExplorer?: string
  defaultGasPrice?: number
  peggedToken?: string
}

export type ChainbridgeConfig = {
  chains: BridgeConfig[]
}

export const crosschainConfig: ChainbridgeConfig = {
  chains: [
    {
      chainId: 1,
      networkId: 1,
      name: 'Ethereum',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x8C397Db5Bb9D421927aa2Da56439b7580561a6Fd',
      rpcUrl: 'https://mainnet.infura.io/v3/8ea75892f7044dd59127696bd2d3b114',
      type: 'Ethereum',
      blockExplorer: 'https://etherscan.io/tx',
      nativeTokenSymbol: 'ETH',
      peggedToken: '0xA90EBf8B3dc8EC5D1b55eAC20735E00ffC24dF9a',
      tokens: [
        {
          address: '0x8a0cdfab62ed35b836dc0633482798421c81b3ec',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        },
        {
          address: '0x66eb10c9B80fC52401384285f5Ecc18C0b924bBd',
          name: 'BACKED',
          symbol: 'BACD2',
          assetBase: 'BACD2',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        }
      ]
    },
    {
      chainId: 56,
      networkId: 56,
      name: 'Binance Smart Chain',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x8C397Db5Bb9D421927aa2Da56439b7580561a6Fd',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      type: 'Ethereum',
      blockExplorer: 'https://bscscan.com/',
      nativeTokenSymbol: 'BNB',
      peggedToken: '0xa032Ef5BD5182696A435B13645bA710224CCa1ad',
      tokens: [
        {
          address: '0x8ea93d00cc6252e2bd02a34782487eed65738152',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        },
        {
          address: '0xc96Ebbc3b3158aAb69312e89fe04C9Cd192BeE01',
          name: 'BACKED',
          symbol: 'BACD2',
          assetBase: 'BACD2',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        }
      ]
    },

    {
      chainId: 137,
      networkId: 137,
      name: 'Polygon',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x754977d76601b473474Ba8FBac0Fa2A20Aa84694',
      rpcUrl: 'https://rpc-mainnet.matic.network/',
      type: 'Ethereum',
      blockExplorer: 'https://polygonscan.com/',
      nativeTokenSymbol: 'MATIC',
      peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
      tokens: [
        {
          address: '0x2fD4D793c1905D82018d75e3b09d3035856890a1',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
        }
      ]
    },

    {
      chainId: 43114,
      networkId: 43114,
      name: 'Avalanche',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x754977d76601b473474Ba8FBac0Fa2A20Aa84694',
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      type: 'Ethereum',
      blockExplorer: 'https://blockscout.com/etc/kotti/tx',
      nativeTokenSymbol: 'AVAX',
      peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
      tokens: [
        {
          address: '0x2fD4D793c1905D82018d75e3b09d3035856890a1',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
        }
      ]
    }
    // {
    //   chainId: 42161,
    //   networkId: 42161,
    //   name: "Arbitrum",
    //   bridgeAddress: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
    //   erc20HandlerAddress: "0x754977d76601b473474Ba8FBac0Fa2A20Aa84694",
    //   rpcUrl: 'https://arb1.arbitrum.io/rpc',
    //   type: "Ethereum",
    //   blockExplorer: 'https://arbiscan.io/',
    //   nativeTokenSymbol: "ETH",
    //   peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
    //   tokens: [
    //     {
    //       address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    //       name: 'Wrapped Ether',
    //       symbol: 'WETH',
    //       assetBase: 'ETH',
    //       decimals: 18,
    //       resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
    //     }
    //   ]
    // },
  ]
}

export const crosschainConfigEthBnb: ChainbridgeConfig = {
  chains: [
    {
      chainId: 1,
      networkId: 1,
      name: 'Ethereum',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x8C397Db5Bb9D421927aa2Da56439b7580561a6Fd',
      rpcUrl: 'https://mainnet.infura.io/v3/8ea75892f7044dd59127696bd2d3b114',
      type: 'Ethereum',
      blockExplorer: 'https://etherscan.io/tx',
      nativeTokenSymbol: 'ETH',
      peggedToken: '0xA90EBf8B3dc8EC5D1b55eAC20735E00ffC24dF9a',
      tokens: [
        {
          address: '0x8a0cdfab62ed35b836dc0633482798421c81b3ec',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        },
        {
          address: '0x66eb10c9B80fC52401384285f5Ecc18C0b924bBd',
          name: 'BACKED',
          symbol: 'BACD2',
          assetBase: 'BACD2',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        }
      ]
    },
    {
      chainId: 56,
      networkId: 56,
      name: 'Binance Smart Chain',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x8C397Db5Bb9D421927aa2Da56439b7580561a6Fd',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      type: 'Ethereum',
      blockExplorer: 'https://bscscan.com/',
      nativeTokenSymbol: 'BNB',
      peggedToken: '0xa032Ef5BD5182696A435B13645bA710224CCa1ad',
      tokens: [
        {
          address: '0x8ea93d00cc6252e2bd02a34782487eed65738152',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        },
        {
          address: '0xc96Ebbc3b3158aAb69312e89fe04C9Cd192BeE01',
          name: 'BACKED',
          symbol: 'BACD2',
          assetBase: 'BACD2',
          decimals: 18,
          resourceId: '0xff3b8b81c6da9e892d5c2b7a9365b04e164dc6aa312522a179a11c68f024e1d9'
        }
      ]
    }

    // {
    //   chainId: 42161,
    //   networkId: 42161,
    //   name: "Arbitrum",
    //   bridgeAddress: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
    //   erc20HandlerAddress: "0x754977d76601b473474Ba8FBac0Fa2A20Aa84694",
    //   rpcUrl: 'https://arb1.arbitrum.io/rpc',
    //   type: "Ethereum",
    //   blockExplorer: 'https://arbiscan.io/',
    //   nativeTokenSymbol: "ETH",
    //   peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
    //   tokens: [
    //     {
    //       address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    //       name: 'Wrapped Ether',
    //       symbol: 'WETH',
    //       assetBase: 'ETH',
    //       decimals: 18,
    //       resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
    //     }
    //   ]
    // },
  ]
}

export const crosschainConfigAvaxPoly: ChainbridgeConfig = {
  chains: [
    {
      chainId: 137,
      networkId: 137,
      name: 'Polygon',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x754977d76601b473474Ba8FBac0Fa2A20Aa84694',
      rpcUrl: 'https://rpc-mainnet.matic.network/',
      type: 'Ethereum',
      blockExplorer: 'https://polygonscan.com/',
      nativeTokenSymbol: 'MATIC',
      peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
      tokens: [
        {
          address: '0x2fD4D793c1905D82018d75e3b09d3035856890a1',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
        }
      ]
    },

    {
      chainId: 43114,
      networkId: 43114,
      name: 'Avalanche',
      bridgeAddress: '0x0b8c93c6aaeabfdf7845786188727aa04100cb61',
      erc20HandlerAddress: '0x754977d76601b473474Ba8FBac0Fa2A20Aa84694',
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      type: 'Ethereum',
      blockExplorer: 'https://blockscout.com/etc/kotti/tx',
      nativeTokenSymbol: 'AVAX',
      peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
      tokens: [
        {
          address: '0x2fD4D793c1905D82018d75e3b09d3035856890a1',
          name: 'Spherium',
          symbol: 'SPHRI',
          assetBase: 'SPHRI',
          decimals: 18,
          resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
        }
      ]
    }
    // {
    //   chainId: 42161,
    //   networkId: 42161,
    //   name: "Arbitrum",
    //   bridgeAddress: "0x0b8c93c6aaeabfdf7845786188727aa04100cb61",
    //   erc20HandlerAddress: "0x754977d76601b473474Ba8FBac0Fa2A20Aa84694",
    //   rpcUrl: 'https://arb1.arbitrum.io/rpc',
    //   type: "Ethereum",
    //   blockExplorer: 'https://arbiscan.io/',
    //   nativeTokenSymbol: "ETH",
    //   peggedToken: '0x4060a15fEdc5702986021fDa286F1e746e32DFC4',
    //   tokens: [
    //     {
    //       address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    //       name: 'Wrapped Ether',
    //       symbol: 'WETH',
    //       assetBase: 'ETH',
    //       decimals: 18,
    //       resourceId: '0x0000000000000000000000aeF40552367F49b3FAFae564C842823f5f79DB1503'
    //     }
    //   ]
    // },
  ]
}

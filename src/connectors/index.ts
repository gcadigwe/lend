import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { UAuthConnector } from '@uauth/web3-react'
import UAuth from '@uauth/js'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  // supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 80001, 43113, 43114]
  supportedChainIds: [1, 56, 43114, 137, 4,97]
})

export const uauthInstance = new UAuth({
  clientID: process.env.REACT_APP_CLIENT_ID!,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET!,
  redirectUri: process.env.REACT_APP_REDIRECT_URI!,
  postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI!,
  // Scope must include openid and wallet
  scope: 'openid wallet'
})

// mainnet only
//added testnets for testing purposes
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  //@ts-ignore
  pollingInterval: 15000
})

// mainnet only
//added testnets for testing purposes

export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 4 || 97 || 1 || 56
})

// mainnet only
//added testnets for testing purposes

export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

export const uauth = new UAuthConnector({
  clientID: process.env.REACT_APP_CLIENT_ID!,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET!,
  redirectUri: process.env.REACT_APP_REDIRECT_URI!,
  postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI!,
  // Scope must include openid and wallet
  scope: 'openid wallet',

  // Injected and walletconnect connectors are required.
  connectors: { injected, walletconnect }
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})

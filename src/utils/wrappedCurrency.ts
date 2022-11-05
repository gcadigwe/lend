import {
  ChainId,
  Currency,
  CurrencyAmount,
  ETHER,
  BNB,
  MATIC,
  AVAX,
  Token,
  TokenAmount,
  WETH
} from '@spherium/swap-sdk'
import { currencyId } from './currencyId'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && (currency === ETHER || currency === BNB || currency === MATIC || currency === AVAX)
    ? WETH[chainId]
    : currency instanceof Token
    ? currency
    : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token, chainId?: ChainId): Currency {
  if (token.equals(WETH[token.chainId]) && token.name === 'Wrapped Ether') return ETHER
  else if (token.equals(WETH[token.chainId]) && token.name === 'Wrapped MATIC') return MATIC
  else if (token.equals(WETH[token.chainId]) && token.name === 'Wrapped AVAX') return AVAX
  else if (
    token.equals(WETH[token.chainId]) &&
    (chainId === ChainId.BSC_MAINNET || (chainId === ChainId.BSC_TESTNET && token.name === 'Wrapped BNB'))
  )
    return BNB
  else if (
    token.equals(WETH[token.chainId]) &&
    (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) &&
      token.symbol === 'WBNB' && token.address === '0x44D1F7001D545a2E7e1F7280d3F6C0D11fb287Db'
  )
    return token
  else return token
}

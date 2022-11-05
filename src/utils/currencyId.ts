import { Currency, ETHER, Token, BNB, MATIC, AVAX } from '@spherium/swap-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ETH'
  if (currency === BNB) return 'BNB'
  if (currency === MATIC) return 'MATIC'
  if (currency === AVAX) return 'AVAX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

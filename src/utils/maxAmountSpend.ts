import { CurrencyAmount, ETHER, JSBI, BNB, MATIC, AVAX, ChainId } from '@spherium/swap-sdk'
import { MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (
    currencyAmount.currency === ETHER ||
    currencyAmount.currency === BNB ||
    currencyAmount.currency === MATIC ||
    currencyAmount.currency === AVAX
  ) {
    const chainId =
      currencyAmount?.currency === ETHER
        ? ChainId.MAINNET || ChainId.ROPSTEN || ChainId.RINKEBY || ChainId.KOVAN || ChainId.GÖRLI
        : currencyAmount?.currency === BNB
        ? ChainId.BSC_MAINNET || ChainId.BSC_TESTNET
        : currencyAmount?.currency === MATIC
        ? ChainId.MUMBAI || ChainId.MATIC
        :ChainId.AVALANCHE || ChainId.FUJI
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH), chainId)
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0), chainId)
    }
  }
  return currencyAmount
}

import { getTokenLogoURL } from './../components/CurrencyLogo/index'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { Currency, Token } from '@spherium/swap-sdk'
import { useCallback, useState } from 'react'
import { useActiveWeb3React } from 'hooks'

export default function useAddTokenToMetamask(
  currencyToAdd: Currency | undefined
): { addToken: () => void; success: boolean | undefined } {
  const { library, chainId } = useActiveWeb3React()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (library && library.provider.isMetaMask && library.provider.request && token) {
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            //@ts-ignore // need this for incorrect ethers provider type
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image:
                token.symbol === 'SPHRI' ||
                token.symbol === 'TOK01' ||
                token.symbol === 'TOK02' ||
                token.symbol === 'TOK03' ||
                token.symbol === 'TOK04' ||
                token.symbol === 'TOK05' ||
                token.symbol === 'TOK06' ||
                token.symbol === 'TOK07' ||
                token.symbol === 'TOK08' ||
                token.symbol === 'SPHRI-X' 
                  ? 'https://raw.githubusercontent.com/LorenaL57/ticker/master/spheriumTickernew.jpg'
                  : getTokenLogoURL(token.address)
            }
          }
        })
        .then(success => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [library, token])

  return { addToken, success }
}

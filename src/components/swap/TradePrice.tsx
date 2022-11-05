import React from 'react'
import { Price, ChainId, BNB } from '@spherium/swap-sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { useActiveWeb3React } from '../../hooks/index'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const { chainId } = useActiveWeb3React()

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${
        chainId === ChainId.BSC_MAINNET || (chainId === ChainId.BSC_TESTNET && price?.quoteCurrency?.symbol === 'ETH')
          ? BNB.symbol
          : price?.quoteCurrency?.symbol
      } per ${price?.baseCurrency?.symbol}`
    : `${
        chainId === ChainId.BSC_MAINNET || (chainId === ChainId.BSC_TESTNET && price?.baseCurrency?.symbol === 'ETH')
          ? BNB.symbol
          : price?.baseCurrency?.symbol
      } per ${
        chainId === ChainId.BSC_MAINNET || (chainId === ChainId.BSC_TESTNET && price?.quoteCurrency?.symbol === 'ETH')
          ? BNB.symbol
          : price?.quoteCurrency?.symbol
      }`

  return (
    <Text
      fontSize={14}
      fontWeight={500}
      color={'#fff'}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} color={'white'} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}

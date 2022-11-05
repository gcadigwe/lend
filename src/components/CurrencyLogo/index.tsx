import { Currency, ETHER, BNB, MATIC, AVAX, Token } from '@spherium/swap-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import BscLogo from '../../assets/images//binance-coin-logo.webp'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import MaticLogo from '../../assets/images/matic.png'
import AVAXLogo from '../../assets/images/avax-logo.svg'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { useActiveWeb3React } from 'hooks'

export const getTokenLogoURL = (address: string) => `https://tokens.bscswap.com/images/${address}.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: 40px;
  height: 40px;
  //box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
  @media (max-width: 500px) {
    width: 30px;
    height: 30px;
  }
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ size }) => size};
  //box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  //background-color: ${({ theme }) => theme.white};

  @media (max-width: 500px) {
    width: 30px;
    height: 30px;
  } 
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const TokenLogo = 'https://raw.githubusercontent.com/LorenaL57/ticker/master/spheriumTickernew.jpg'
  const WmaticLogo = 'https://raw.githubusercontent.com/LorenaL57/ticker/master/poly.png'
  const AvaxLogo = 'https://raw.githubusercontent.com/LorenaL57/ticker/master/avalanche-avax-logo.png'
  const BackedLogo = 'https://raw.githubusercontent.com/LorenaL57/ticker/master/backed.png'

  
  const { chainId } = useActiveWeb3React()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={{ width: 35, height: 35, marginRight: 10 }} />
  }
  if (currency?.symbol === 'WETH' && chainId !== 1) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={{ width: 35, height: 35, marginRight: 10 }} />
  }

  if (currency === MATIC || currency?.symbol === 'MATIC') {
    return <StyledEthereumLogo src={WmaticLogo} size={size} style={{ width: 35, height: 35, marginRight: 10 }} />
  }
  if (currency === AVAX || currency?.symbol === 'Alpha') {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={{ width: 35, height: 35, marginRight: 10 }} />
  }
  if (currency?.symbol === 'BACD2') {
    return <StyledEthereumLogo src={BackedLogo} size={size} style={{ width: 35, height: 35, marginRight: 10 }} />
  }

  if (
    currency?.symbol === 'SPHRI' ||
    currency?.symbol === 'TOK01' ||
    currency?.symbol === 'TOK02' ||
    currency?.symbol === 'TOK03' ||
    currency?.symbol === 'TOK04' ||
    currency?.symbol === 'TOK05' ||
    currency?.symbol === 'TOK06' ||
    currency?.symbol === 'TOK07' ||
    currency?.symbol === 'TOK08'
  ) {
    return <StyledEthereumLogo src={TokenLogo} size={size} style={style} />
  } else if (currency === BNB) {
    return <StyledEthereumLogo src={BscLogo} size={size} style={style} />
  }

  if (
    currency?.symbol === 'BNB' ||
    currency?.symbol === 'WBNB' ||
    currency?.symbol === 'wBNB' ||
    currency?.symbol === 'eBNB'
  ) {
    return <StyledEthereumLogo src={BscLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

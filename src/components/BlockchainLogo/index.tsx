
import BSCLogo from '../../assets/images/bnb.svg'
import EthereumLogo from  '../../assets/images/eth.svg'
import MaticLogo from '../../assets/images/poly.svg'
import AVAXLogo from '../../assets/images/avax-logo.svg'

import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import DollarCoin from '../../assets/images/dollarcoin.svg'
import ArbitrumLogo from '../../assets/images/arbitrum.svg'



const StyledEthereumLogo = styled.img<{ size: string }>`
  width: 25px;
  height: 25px;
  //box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
  //margin-left: 5px;
  //margin-right: 5px;
`

export default function BlockchainLogo({
  blockchain,
  size = '36px',
  style
}: {
  blockchain?: string
  size?: string
  style?: React.CSSProperties
}) {
  const {  account } = useWeb3React()
  
  if (blockchain === 'Ethereum' || blockchain === 'ETH') {
    return <StyledEthereumLogo src={ account ? EthereumLogo : DollarCoin} size={size} style={style} />
  }
  if ( blockchain === 'Arbitrum' || blockchain === 'Arbitrum TestNet') {
    return <StyledEthereumLogo src={ account ? ArbitrumLogo : DollarCoin} size={size} style={style} />
  }

  if (blockchain === 'Polygon' || blockchain === 'Mumbai' || blockchain === 'Matic' ) {
    return <StyledEthereumLogo src={MaticLogo} size={size} style={style}  alt="POLY"/>
  }

  if (blockchain === 'Avalanche' || blockchain === 'Fuji') {
    return <StyledEthereumLogo src={AVAXLogo} size={size} style={style}  alt="AVAX"/>
  }
  if (blockchain === 'Smart Chain' || blockchain === 'Smart Chain Test' || blockchain === 'Binance Smart Chain') {
    return <StyledEthereumLogo src={ account ? BSCLogo : DollarCoin} alt="BNB" size={size} style={style} />
  }

  if (blockchain === undefined) {
    return <StyledEthereumLogo src={DollarCoin} alt="none" size={size} style={style} />
  }

  return <StyledEthereumLogo src={ account ? EthereumLogo : DollarCoin} size={size} style={style} />
}


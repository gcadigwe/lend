import React from 'react'
import PairNotFound from '../../../assets/images/pairNotfound.png'
import styled from 'styled-components'
import Web3Status from 'components/Web3Status'
import useWindowDimensions from 'hooks/useWindowDimensions'

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;

  & .web3status {
    width: 80%;
    margin: auto;
    display: flex;
    justify-content: center;
  }
`

const ConnectWallet = () => {
  const { width } = useWindowDimensions()

  return (
    <ConnectWalletWrapper>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          position: 'relative',
          bottom: width < 1365 ? 0 : 100
        }}
      >
        {/* <img src={PairNotFound} alt="Connect wallet" width={width < 500 ? 260 : 290} /> */}
        <p style={{ display: 'flex',  fontWeight: 200, fontSize: 18, textAlign: 'center' }}>
          No liquidity Found
        </p>
        <p style={{ fontSize: 24, fontWeight: 500,  maxWidth: 309 }}>
          Don't see Your Liquidity Pool you joined?
        </p>
        <div className="web3status">
          <Web3Status />
        </div>
      </div>
    </ConnectWalletWrapper>
  )
}

export default ConnectWallet

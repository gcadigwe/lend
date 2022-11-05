import { TokenAmount } from '@spherium/swap-sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
//import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../Column'

import styled from 'styled-components'

import Logo from '../../assets/images/logo-white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { useMedia } from 'react-use'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { isBSC } from 'utils/checkBSC'
import Account from '../../components/Account'
import { RowBetween } from 'components/Row'
import Footer from 'pages/Footer'

const Title = styled.a`
  display: flex;
  width: auto;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  //margin-right: 26px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    margin-right: 0px;
  `};
  :hover {
    cursor: pointer;
  }
`

const SpheriumIcon = styled.div`
  transition: transform 0.3s ease;
`

const AppWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: self-end;
  flex-direction: row;

  // @media (max-width: 845px) {
  //   position: relative;
  //   height: initial;
  // }
  height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: 54px;
  align-items: center;
  //display: none;
  

`};
`

const ContentWrapper = styled(RowBetween)`
  margin-left: 75px;
  margin-right: 32px;
  align-items: center;
  margin-top: 14px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin: 0px 0px;  

`};
`

const HyperLendWrapper = styled.div`
  display: flex;
  align-items: center;
`

const HyperLendText = styled.text`
  font-size: 24px;
  margin-right: 10px;
  margin-left: 20px;
  font-weight: 700;
  color: #ffffff;
`

const HyperLendDesc = styled.text`
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  opacity: 0.6;
`

export default function DesktopHeader() {
  const { account, chainId } = useActiveWeb3React()
  const below500 = useMedia('(max-width: 500px)')

  return (
    <AppWrapper>
      <ContentWrapper>
        {below500 && <Footer />}

        <Title
          style={{
            display: 'flex',
            position: 'relative',
            bottom: below500 ? 0 : 18,
            width: '100%',
            justifyContent: below500 ? 'center' : 'flex-start'
          }}
        >
          <SpheriumIcon>
            <img src={Logo} alt="logo" width={160} />
          </SpheriumIcon>

          {!below500 && (
            <HyperLendWrapper>
              <HyperLendText>Hyperlend</HyperLendText>
              <HyperLendDesc>Cross-chain interoperability</HyperLendDesc>
            </HyperLendWrapper>
          )}
        </Title>
        {!below500 && <Account />}
      </ContentWrapper>
    </AppWrapper>
  )
}

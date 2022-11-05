import { TokenAmount } from '@spherium/swap-sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
//import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../Column'

import styled from 'styled-components'

import Logo from '../../assets/images/logo-white.svg'
//import LogoDark from '../../assets/svg/logo_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
//import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'
import { ChevronDown, ChevronUp } from 'react-feather'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import { useMedia } from 'react-use'
import ClaimModal from '../claim/ClaimModal'
import {
  useToggleSelfClaimModal,
  useShowClaimPopup,
  useOpenModal,
  useWyreModalToggle,
  useModalOpen
} from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import { isBSC } from 'utils/checkBSC'
//import usePrevious from '../../hooks/usePrevious'
import Footer from 'pages/Footer'
import icon from '../../assets/images/hyperswap.png'
import BridgeActive from '../../assets/images/bridgeactive.svg'
import BridgePassive from '../../assets/images/bridgepasive.svg'
import LiquidityActive from '../../assets/images/liquidityactive.svg'
// import LiquidityPassive from '../../assets/images/liquiditypassive.svg'
import PairsActive from '../../assets/images/parisActive.svg'
import PairsPassive from '../../assets/images/pairspassive.svg'
import SwapActive from '../../assets/images/swapactive.svg'
import SwapPassive from '../../assets/images/swappasive.svg'
import HyperLendicon from '../../assets/images/hyperlend.png'
import WyerBG from '../../assets/svg/wyre_bg.svg'
import { ApplicationModal } from 'state/application/actions'
import WyreLogo from '../../assets/svg/wyre_logo.svg'
import ArrowRight from '../../assets/svg/arrowRightDark.svg'
import Loader from '../../pages/staking/loader/Loader'
// const HeaderFrame = styled.div`
//   display: flex;
//   grid-template-columns: 1fr 120px;
//   justify-content: space-between;
//   align-items: center;
//   flex-direction: row;
//   top: 0;
//   position: relative;
//   z-index: 2;
//   width: 100%;
//   height: 100px;
//   padding: 24.1px 98px 23.9px 98px;
//   background-color: ;
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     grid-template-columns: 1fr;
//     padding: 0 1rem;
//     width: calc(100%);
//     position: relative;
//   `};

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//         padding: 0.5rem 1rem;
//         font-size: 15px;
//   `}

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//       height: auto;
//    `}
// `

// const HeaderControls = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-self: flex-end;
//   flex-direction: row-reverse;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     flex-direction: row;
//     justify-content: space-between;
//     justify-self: center;
//     width: 100%;
//     max-width: 960px;
//     padding: 1rem;
//     position: fixed;
//     bottom: 0px;
//     left: 0px;
//     z-index: 99;
//     height: 72px;
//     border-radius: 12px 12px 0 0;
//     background-color: ${({ theme }) => theme.bg1};

//   `};
// `

// const HeaderElement = styled.div`
//   display: flex;
//   z-index: 11;
//   align-items: flex-end;
//   flex-direction: column-reverse;
//   padding: 27px 30px 20px 0px;

//   /* addresses safari's lack of support for "gap" */
//   & > *:not(:first-child) {
//     margin-left: 8px;
//   }

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//    flex-direction: row-reverse;
//     align-items: center;
//   `};
// `

// const HeaderElementWrap = styled.div`
//   display: flex;
//   align-items: center;
// `

// const HeaderRow = styled(RowFixed)`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//    width: 100%;
//    justify-content: space-between;
//   `};

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     padding: 10px;
//     margin-bottom: 10px;
//   `}
// `

// const HeaderLinks = styled(Row)`
//   justify-content: center;
//   width: 100%;
//   padding-right: 10px;
//   font-weight: normal;
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//   padding: 1rem 0px 1rem 1rem;
//   -webkit-box-pack: end;
//   justify-content: space-around;
//   padding-right: 15px;
// `};
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     width: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding-right: 0px;
//     padding-top: 10px;
//   `}
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//      justify-content: center;
//   `}

//  @media(min-width: 723px) {
//     justify-content: flex-end;
//   }

//   @media (min-width: 960px) {
//     justify-content: center;
//   }
// `

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-image: linear-gradient(to right, #5b94ed -14%, #5960f7 106%);
  border-radius: 8px;
  white-space: nowrap;
  width: 300px;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: row;
   align-items: center;
 `};
`

// const UNIAmount = styled(AccountElement)`
//   color: white;
//   padding: 4px 8px;
//   height: 36px;
//   font-weight: 500;
//   background-color: ${({ theme }) => theme.bg3};
//   background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
// `

// const UNIWrapper = styled.span`
//   width: fit-content;
//   position: relative;
//   cursor: pointer;

//   :hover {
//     opacity: 0.8;
//   }

//   :active {
//     opacity: 0.9;
//   }
// `

// const BalanceText = styled(Text)`
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     display: none;
//   `};
// `

// const Title = styled.a`
//   display: flex;
//   width: 100%
//   align-items: center;
//   pointer-events: auto;
//   justify-self: flex-start;
//   //margin-right: 26px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     justify-self: center;
//     margin-right: 0px;
//   `};
//   :hover {
//     cursor: pointer;
//   }
// `

const SpheriumIcon = styled.div`
  transition: transform 0.3s ease;
`

const activeClassName = 'ACTIVE'
const StyledNavLink = styled(NavLink).attrs<{ chain: number }>({
  activeClassName
})`
  cursor: pointer;
  color: #fff;
  opacity: 0.6;
  padding: 12px 12px;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: normal;
  align-items: center;
  display: flex;
  border-left: none;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  z-index: 1;
  transition: all 300ms ease;
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 143% */

  color: #ffffff;

  /* Inside auto layout */

  &.${activeClassName} {
    //border-right: 2px solid #7469DA;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    opacity: 1;
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  border-left: none;

  &.${activeClassName}{
    color: #fff;
    font-weight: 400;
    border-left: none;

  }
  
`};
`

// const LiqPas = styled.img.attrs({
//   activeClassName
// })`
//   &.${activeClassName} {
//     border-left: 2px solid #2e37f2;
//     color: #2e37f2;
//   }
// `

// const StyledExternalLink = styled(ExternalLink).attrs({
//   activeClassName
// })<{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text1};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
// `}
// `
// const TransferButton = styled.button`
//   color: white;
//   padding: 0.6rem 1.4rem;
//   border: none;
//   position: relative;
//   cursor: pointer;
//   text-decoration: none;
//   z-index: 1;
//   margin-right: 14px;
//   border-radius: 15px;
//   background-color: #182128;
//   transition: all 300ms ease;
//   -webkit-box-shadow: -1px 1px 3px 5px rgba(0, 0, 0, 0.3);
//   -moz-box-shadow: -1px 1px 5px 5px rgba(0, 0, 0, 0.3);
//   box-shadow: -1px 1px 3px 5px rgba(0, 0, 0, 0.3);
//   &:hover {
//     background-color: ${(props: { chainId: number | undefined }) => (isBSC(props.chainId) ? '#f3ba2f' : '#87F2E7')};
//   }

//   &.${activeClassName} {
//     border: 2px solid ${(props: { chainId: number | undefined }) => (isBSC(props.chainId) ? '#f3ba2f' : '#87F2E7')};
//   }
// `

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`
// const Spherium = styled.p`
//   width: 88px;
//   height: 12.6px;
//   font-size: 16px;
//   display: flex;
//   align-items: center;
//   font-weight: normal;
//   font-stretch: normal;
//   font-style: normal;
//   letter-spacing: 0.48px;
//   text-align: right;
// `

// const Container = styled.div`
//   //max-width: 1200px;
//   width: 100%;
//   margin-top: 0.5rem;
// `

const AppWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  //z-index: 11;

  @media (max-width: 845px) {
    position: relative;
    height: initial;
  }
`

const Wrapper = styled.div`
  height: 100%;
  width: 300px;
  border-top: none;
  color: ${({ theme }) => theme.text1};
  border: 1px solid rgba(255, 255, 255, 0.06);
  top: 0px;
  left: 0px;
  box-sizing: border-box;
  border-top: none;
  color: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToNormal`
  width: 220px;

`};

  @media (max-width: 845px) {
    width: 100%;
    align-items: center;
    flex-direction: row;
    height: initial;
  }
`

// const Option = styled.div`
//   font-weight: 500;
//   font-size: 14px;
//   opacity: 0.6;
//   color: ${({ theme }) => theme.white};
//   display: flex;
//   :hover {
//     opacity: 1;
//   }
// `

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
  width: 296px;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  width: 220px;

`};

  @media (max-width: 845px) {
    width: 100%;
    align-items: baseline;
    flex-direction: row !important;
    height: initial;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  align-items: center;
  justify-content: center;
  flex-direction: row-reverse !important;
  height: 100px;
`};
`

const HeaderText = styled.div`
  margin-right: 0.75rem;
  font-size: 0.825rem;
  font-weight: 500;
  display: inline-box;
  display: -webkit-inline-box;
  //opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: ${({ theme }) => theme.white};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
 margin-right: 0.5;
`};
`

const Hyperswap = styled.div`
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  //width: 185px;
  margin-left: 78px;
  height: 24px;
  color: white;
  border-right: 2px solid #7469da;
  :hover {
    opacity: 1;
  }

  @media (max-width: 845px) {
    display: none !important;
  }
`

const HyperLend = styled.div`
  font-weight: 500;
  cursor: pointer;
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: center;
  //width: 185px;
  height: 50px;
  color: black;
  border-radius: 10px;
  margin-top: 50px;
  :hover {
    opacity: 1;
  }

  @media (max-width: 845px) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 0px;
  }
`

const HeaderLinkWrap = styled.div`
  display: grid;
  //border-left: solid 0.5px #828db0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  border-left: none;
`};
`

const FooterWrapper = styled(AutoColumn)`
  margin-right: 0.75rem;
  margin-bottom: 4rem;

  @media (max-width: 845px) {
    margin-bottom: 0rem;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  
  margin-left: .5rem;
  margin-right: 0rem;

`};
`

const WyreWrapper = styled(AutoColumn)`
  & > div {
    width: 170px;
    height: 118px;
    background: url(${WyerBG});
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 10px;

    .text {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #2a324a;
    }

    button {
      padding: 5px;
      width: 126px;
      height: 28px;
      background: linear-gradient(207.81deg, rgba(255, 255, 255, 0.54) -104.56%, rgba(255, 255, 255, 0) 155.44%);
      border-radius: 25px;
      border: none;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      .wyre {
        width: 57px;
        height: 18px;
      }

      .buyNow {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: #ffffff;
        margin-left: 8px;
      }

      .arrow {
        width: 20px;
        height: 20px;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          display: inline-block;
          width: 12px;
        }
      }
    }
  }
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [clicked, setClicked] = useState(false)
  const [transferclicked, setTransferClicked] = useState(false)

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  //const [darkMode, toggleDarkMode] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const below500 = useMedia('(max-width: 500px)')
  const below845 = useMedia('(max-width: 845px)')
  const wyreModalOpen = useModalOpen(ApplicationModal.WYRE)
  const toggleWyreModal = useWyreModalToggle()

  const [loading, setLoading] = useState(false)

  //const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  //const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <AppWrapper>
      <Loader open={loading} />
      <Wrapper>
        <DesktopWrapper style={{ flexDirection: below500 ? 'row-reverse' : 'column' }}>
          <AutoColumn gap="1rem" style={{ display: 'block' }}>
            <AutoColumn gap="1.25rem" style={{ display: below500 ? 'flex' : 'block' }}>
              <HeaderLinkWrap
                style={{
                  display: !below500 && !below845 ? 'block' : below845 ? 'flex' : 'flex',
                  marginLeft: 78
                  // marginTop: '3rem'
                }}
              >
                <Hyperswap
                  onClick={() => setClicked(clicked)}
                  style={{ display: below500 ? 'none' : 'flex', margin: 'auto', justifyContent: 'flex-start' }}
                >
                  <StyledNavLink id={`swap-nav-link`} to={'/'}>
                    <Text
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        fontSize: 16,

                        fontWeight: 600,
                        opacity: 0.4,
                        marginLeft: 11
                      }}
                    >
                      Hyperlend
                    </Text>
                  </StyledNavLink>
                </Hyperswap>
              </HeaderLinkWrap>
            </AutoColumn>
          </AutoColumn>

          <FooterWrapper>
            <HeaderText>
              <Footer />
            </HeaderText>
          </FooterWrapper>
        </DesktopWrapper>
      </Wrapper>
    </AppWrapper>
  )
}

/* eslint-disable react/no-unescaped-entities */
import React, { Suspense, useEffect, useState } from 'react'
import { ChainId } from '@spherium/swap-sdk'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import MobileHeader from '../components/MobileHeader/index'
import AddLiquidity from './AddLiquidity'

// import {
//   RedirectDuplicateTokenIds,
//   RedirectOldAddLiquidityPathStructure,
//   RedirectToAddLiquidity
// } from './AddLiquidity/redirects'
import Manage from './Earn/Manage'
import MigrateV1 from './MigrateV1'
import Migrate from './Migrate'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
//import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import {
  OpenClaimAddressModalAndRedirectToSwap,
  RedirectPathToPairsOnly,
  RedirectPathToSwapOnly,
  RedirectToSwap
} from './Swap/redirects'
import Earn from './Earn'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import TopPairs from './Pairs/index'
import CrossChain from './CrossChain/index'
import Staking from './staking/index'
import { useDarkModeManager } from '../state/user/hooks'
import { injected } from '../connectors'
import { useActiveWeb3React } from '../hooks'
import LiquidityPool from 'components/liquidityPool'
import WyreModal from 'components/wyre/WyreModal'
import useWindowDimensions from 'hooks/useWindowDimensions'
import DesktopHeader from 'components/DesktopHeader'
import Lending from './Lending'
import CopyRight from 'components/Copyright'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AppWrapper = styled.div`
  background: radial-gradient(2040px 2007px at top, rgba(197, 151, 255, 0.12), transparent, transparent),
    radial-gradient(1040px 2009px at left, rgba(75, 191, 241, 0.12), transparent, transparent);
  display: block;
  grid-template-columns: 256px 1fr;
  flex-flow: column;
  align-items: flex-start;
  // overflow: auto;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToNormal`
  grid-template-columns: 220px 1fr;
  height: auto;


`};

  @media (max-width: 845px) {
    display: block;
    width: 100%;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  width: 100%;
  flex-direction: column-reverse;
  background: #06070B;

`};
`

const HeaderWrapper = styled.div`
  height: 100%;
  ${({ theme }) => theme.flexRowNoWrap}
  //width: 260px;
  display: flex;
  //z-Index: 11;
  justify-content: space-between;

  @media (max-width: 845px) {
    width: 100%;
    height: initial;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

  width: 100%;
  height: 100px;
  position: fixed;
  background: #06070B;
  //display: none;
  z-index: 999;
  bottom: 0px;
  

`};
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  //margin-bottom: 3rem;
  align-items: flex-start;
  //background: radial-gradient(1040px 2009px at left, rgba(75, 191, 241, 0.12), transparent, transparent);
  justify-content: flex-start
  flex: 1;
  //position: relative;
  z-index: 10;
  
  @media (max-width: 845px) {
    display: block;
    width: 100%;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

  display: flex;
  flex-direction: column-reverse;
`};
`

const Marginer = styled.div`
  margin-top: 0rem;
`
const ContentWrapper = styled.div`
  display: grid;
  grid-template-rows: max-content;
  height: inherit;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

  // display: grid;
  // max-width: 100%;
  // width: 100%;
  display: block;

`};
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

export function addBscNetwork() {
  const isMetamask = window.ethereum && window.ethereum.isMetaMask

  injected.getProvider().then(provider => {
    if (!provider && isMetamask) return
    provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [BINANCE_TESTNET_PARAMS]
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
}

export function addBscMainnetNetwork() {
  const isMetamask = window.ethereum && window.ethereum.isMetaMask

  injected.getProvider().then(provider => {
    if (!provider && isMetamask) return
    provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [BINANCE_MAINNNET_PARAMS]
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
}

export const BINANCE_TESTNET_PARAMS = {
  chainId: '0x61', // A 0x-prefixed hexadecimal chainId
  chainName: 'Binance Testnet C-Chain',
  nativeCurrency: {
    name: 'Binance',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com']
}

export const BINANCE_MAINNNET_PARAMS = {
  chainId: '0x38', // A 0x-prefixed hexadecimal chainId
  chainName: 'Binance Mainnet C-Chain',
  nativeCurrency: {
    name: 'Binance',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com']
}

export default function App() {
  function hashHandler() {
    window.scrollTo(0, 0)
  }

  window.addEventListener('hashchange', hashHandler, false)

  // useEffect(() => {
  //   const handler = (e: Event) => {
  //     if (!modelRef.current?.contains(e.target as any)) {
  //       setOpenTransferModel(false)
  //     }
  //   }
  //   document.addEventListener('mousedown', handler)

  //   return () => {
  //     document.removeEventListener('mousedown', handler)
  //   }
  // }, [modelRef])

  const wyreOpenModal = useModalOpen(ApplicationModal.WYRE)
  const { width } = useWindowDimensions()

  return (
    <>
      <Suspense fallback={null}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="colored"
        />
        <WyreModal isOpen={wyreOpenModal} />
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <AppWrapper style={{ overflow: window.location.hash.includes('#/pool') ? '' : 'auto' }}>
          {/* <URLWarning /> */}
          <ContentWrapper>
            <DesktopHeader />
            <BodyWrapper>
              <HeaderWrapper>{width < 500 ? <MobileHeader /> : <Header />}</HeaderWrapper>
              <Popups />
              <Polling />
              <TopLevelModals />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/" component={Lending} />
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </Suspense>
    </>
  )
}

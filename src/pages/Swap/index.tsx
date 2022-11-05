import { CurrencyAmount, JSBI, Token, Trade, MATIC } from '@spherium/swap-sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { Link as Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowDown } from 'react-feather'
import { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import BetterTradeLink, { DefaultVersionLink } from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'
//import SwapHeader from '../../components/swap/SwapHeader'
import DoubleArrow from '../../assets/images/double-arrow.svg'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { getTradeVersion } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'

import Account from '../../components/Account'
import PairNotFound from '../../assets/images/pairsPlaceholder.png'
import Settings from '../../components/Settings'
import { useETHBalances } from '../../state/wallet/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
//import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { isTradeBetter } from 'utils/trades'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import spheriumLogo from '../../assets/images/spherium logo.png'
//import { useDarkModeManager } from '../../state/user/hooks'
import { TopPair } from 'state/pairs/reducer'
import { useLocation } from 'react-router-dom'
import { getParams } from 'utils/getParams'
import { fetchSinglePair } from 'utils/fetchData'
import PairGraph, { GraphWrapper } from 'components/PairGraph'
import { useMedia } from 'react-use'
import Logo from '../../assets/images/spherium logo.png'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import CurrencyLogo from 'components/CurrencyLogo'
import CurrencyOutputPanel from 'components/CurrencyInputPanel/output'
import CopyRight from 'components/Copyright'

const DoubleArrowWrapper = styled.div`
  z-index: 1;
  :hover {
    cursor: pointer;
  }
`
const ArrowIcons = styled.img`
  width: 11px;
  height: 22px;
`
const GraphPlaceholder = styled(GraphWrapper)<{ height: number }>`
  height: ${({ height }) => `${height}%`};
  width: 100%;
  //margin-bottom: 20px;
  //margin-top: 10px;
  display: flex;

  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  background-color: transparent;
  padding: 20px;
  z-index: 11;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //background-color: #06070B;
`};
  .recharts-surface {
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    // height: 400px !important;
  }

  .recharts-wrapper {
    width: 100% !important;
    height: 400px !important;
  }
`

// const MiniCards = styled.div`
//   width: 100%;
//   min-height: 113px;
//   height: 100%;
//   //min-width: 390px;
//   background-color: #212a3b;
//   border-radius: 8px;
//   position: relative;
//   padding: 0px 17px 0px 17px;
//   display: grid;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//   display: grid;
//   border-radius: 8px;
//   //max-width: 0px;
//   //min-width: 540px

// `};

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   display: grid;
//   border-radius: 8px;
//   //max-width: 606px;
//   min-width: 0px;

// `};
// `
// const StatsWrapper = styled.div`
//   width: 100%;
//   background-color: #212a3b;
//   padding: 15px 15px;
//   margin-bottom: 10px;
//   border-radius: 8px;
//   //max-width: 980px;
//   position: relative;
//   flex-direction: row;

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     margin-bottom: 10px;
//     //max-width: 530px;
//     //margin-left: 12px;
//     padding: 20px 15px;

//   `};

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     margin-bottom: 10px;
//     //max-width: 430px;
//     //margin-left: 12px;
//     padding: 20px 15px;
//   `};

//   @media (min-width: 1260px) {
//     max-width: 980px;
//     margin-bottom: 10px;
//   }

//   /* @media (max-width: 950px) {
//     width: auto;
//     margin-bottom: 10px;
//   } */

//   @media (min-width: 950px) {
//     max-width: 980px;
//   }
// `

// const Wrapper = styled.div`
//   flex-direction: row;
//   //padding: 0px 98px 0px 98px;
//   width: 100%;
//   height: 100%;
//   //max-width: 1075px;
//   position: relative;
//   gap: 10px;
//   display: flow-root;
//   align-items: center;
//   justify-content: center;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//   display: block;
//   margin-bottom: 12px;
// `};

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   //padding: 1rem;
//   display: block;
//   `};
// `

const ApBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  //background-color: #06070B;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    //padding: 2rem;
    display: grid;
    width: 100%;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem;
    display: grid;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 0px;
  display: block;
  //background-color: #06070B;
`};
`
const AppWrapper = styled.div`
  width: 100%;
  border-left: none;
  height: 100%;
  max-width: 40%;
  justify-content: end;
  display: inline-flex;
  flex-direction: column;
  flex-flow: column;
  align-items: center;
  //overflow-x: hidden;

  //padding: 0px 50px 0px 50px;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px;
    display: block;

  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  overflow-x: visible;

`};
`
const CardsWrapper = styled.div`
  display: grid;
  gap: 8px;
  width: 39%;
  height: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100%;
  margin-bottom: 12px;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
   width: 100%;
   margin-bottom: 10px;

 `};
`
const Title = styled.a`
  display: flex;
  padding: 0px 20px;
  width: 100%
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  height: 80px;

  margin-right: 26px;
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

// // Chat compoents
// const ChartImage = styled.img`
//   width: 120px;
//   height: 120px;
// `

// const HeaderRow = styled.div`
//   ${({ theme }) => theme.flexRowNoWrap};
//   padding: 1.72rem 1rem;
//   font-weight: 500;
//   border-bottom 1px solid rgba(255, 255, 255, 0.06);;
//   color: black;
//   background-color: transparent;
//   font-size: 18px;
//   font-weight: 500;
//   font-stretch: normal;
//   font-style: normal;
//   line-height: 1.5;
//   letter-spacing: 0.54px;
//   text-align: left;
// `
const UpperSection = styled.div`
  height: 84px;
  margin-bottom: 5px;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  display: flex;
  padding-left: 10px;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
`};
`

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  display: grid;
  overflow: visible;


`};
`

const GraphDiv = styled.div`
  background: radial-gradient(940px 909px at center, rgba(52, 56, 91, 0.1), transparent, transparent);
  display: flow-root;
  width: 100%;
  height: 100%;
  position: relative;
  max-width: 60%;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-bottom: 170px;
  background: none;
  //display: none;
  `};
`
const OverViewTxt = styled.p`
  font-weight: 500;
  margin-top: 30px;
  font-size: 24px;
  width: 35%;

  @media (max-width: 845px) {
    display: none;
  }
`

const InputWrapper = styled(AutoColumn)`
  display: block;
  margin: 32px;
  margin-bottom: 23px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding-bottom: 5px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //padding: 25px 0px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 0px 15px;
`};
`

const Spherium = styled.p`
  width: 88px;
  height: 12.6px;
  font-size: 16px;
  display: flex;
  align-items: center;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.48px;
  text-align: right;
`

const CreateButton = styled(Redirect)`
  padding: 15px;
  font-size: 18px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  text-decoration: none;
  color: #fff;

  :hover {
    border: 2px solid #2e37f2;
  }

  :focus {
    background: #2e37f2;
    color: #fafbff;
  }
`
const BodyContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 90%;
  height: inherit;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  grid-template-rows: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  `};
`

export default function Swap() {
  //const [darkMode] = useDarkModeManager()

  const loadedUrlParams = useDefaultsFromURLSearch()
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),

    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const { account, chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
  const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

  const betterTradeLinkV2: Version | undefined =
    toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade) ? Version.v2 : undefined

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  let receivedValue: string
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade, chainId)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade)
          ].join('/')
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled'
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly
  ])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])
  // const [output, setOutput] = useState('')
  //@todo- Ahmed Ibrahim
  const handleOutputSelect = useCallback(
    outputCurrency => {
      // setOutput(JSON.stringify(outputCurrency))
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  function currencyText() {
    if (chainId === 97 || chainId === 56) {
      return 'BNB'
    }
    if (chainId === 137 || chainId === 80001) {
      return 'MATIC'
    }
    if (chainId === 43113 || chainId === 43114) {
      return 'AVAX'
    } else return 'ETH'
  }

  const currencytxt = currencyText()

  const { OUTPUT, INPUT } = useSelector<AppState, AppState['swap']>(state => state.swap)
  // @update when choose the second token
  const [currentPair, setCurrentPair] = useState<TopPair | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  // @todo => update this to get from the api
  const SINGLE_PAIR_URL = `https://app.spherium.finance/v1/pairs/info/api/v1/pair`

  useEffect(() => {
    if (!OUTPUT.currencyId || !INPUT.currencyId || !chainId) return
    setLoading(true)
    fetchSinglePair(chainId, INPUT.currencyId, OUTPUT.currencyId, SINGLE_PAIR_URL, setLoading, setError, setCurrentPair)
  }, [OUTPUT, INPUT, SINGLE_PAIR_URL, chainId])
  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)
  // GET pair when the user come from home page
  const { search } = useLocation()
  const { outputParam, inputParam } = getParams(search)
  useEffect(() => {
    if (!inputParam || !outputParam || !chainId) return
    // pre select the token
    handleInputSelect({
      address: inputParam
    } as Token)
    handleOutputSelect({
      address: outputParam
    } as Token)
    setLoading(true)
    fetchSinglePair(chainId, inputParam, outputParam, SINGLE_PAIR_URL, setLoading, setError, setCurrentPair)
  }, [inputParam, outputParam, chainId, handleInputSelect, handleOutputSelect, SINGLE_PAIR_URL])

  const below500 = useMedia('(max-width: 500px)')

  const { width } = useWindowDimensions()

  return (
    <>
      <BodyContent>
        <TokenWarningModal
          isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
          tokens={importTokensNotInDefault}
          onConfirm={handleConfirmTokenWarning}
        />
        <SwapPoolTabs active={'swap'} />
        <ContentWrapper>
          <AppWrapper>
            <ApBody>
              {/* <Title style={{ display: below500 ? 'flex' : 'none' }}>
              <SpheriumIcon>
                <img style={{ width: 35, marginRight: 8, display: 'none' }} src={Logo} alt="logo" />
              </SpheriumIcon>
              <Spherium style={{ display: !account ? 'flex' : 'none' }}>
                <Text style={{ color: '#151928', fontWeight: 'bold', fontSize: 21 }}>SPHERIUM</Text>
              </Spherium>
              <Account />
            </Title> */}
              <div>
                <RowBetween
                  style={{
                    color: '#fff',
                    gap: width < 500 ? 0 : 12,
                    position: 'relative',
                    top: width < 500 ? '-8px' : '26.5px',
                    paddingBottom: width < 500 ? 10 : 20,
                    paddingLeft: width < 500 ? 15 : 32,
                    paddingRight: width < 500 ? 15 : 40,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: width < 500 ? 14 : 0,
                    borderRadius: width < 500 ? 20 : 0,
                    backgroundColor: 'none'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: width < 500 ? 'baseline' : 'flex-start',
                      gap: width < 500 ? 12 : 0
                    }}
                  >
                    <span style={{ fontSize: width < 500 ? 18 : 24, fontWeight: 500 }}>Exchange</span>
                    <span
                      style={{
                        justifyContent: 'end',
                        color: '#fff',
                        position: 'relative',
                        top: width < 500 ? '0px' : '6px',
                        left: width < 500 ? 0 : 12,
                        width: '100%',
                        fontWeight: 500,
                        fontSize: 12,
                        opacity: 0.6
                      }}
                    >
                      Trade tokens in an instant
                    </span>
                  </div>
                  <RowBetween style={{ justifyContent: 'flex-end', width: 50 }}>
                    <Settings />
                  </RowBetween>
                </RowBetween>
                <ConfirmSwapModal
                  isOpen={showConfirm}
                  trade={trade}
                  originalTrade={tradeToConfirm}
                  onAcceptChanges={handleAcceptChanges}
                  attemptingTxn={attemptingTxn}
                  txHash={txHash}
                  recipient={recipient}
                  allowedSlippage={allowedSlippage}
                  onConfirm={handleSwap}
                  swapErrorMessage={swapErrorMessage}
                  onDismiss={handleConfirmDismiss}
                  chainId={chainId}
                />

                <InputWrapper>
                  <AutoColumn
                    style={{
                      display: 'block',
                      backgroundColor: width < 500 ? '#0E1218' : '#000',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      borderRadius: 12,
                      height: 184
                    }}
                  >
                    <CurrencyInputPanel
                      label={
                        independentField === Field.OUTPUT && !showWrap && trade
                          ? 'Swap From (estimated) '
                          : 'Swap From: '
                      }
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />
                    <AutoColumn
                      justify="space-between"
                      style={{
                        padding: '0px',
                        display: 'block',
                        position: 'relative',
                        bottom: width < 500 ? 25 : 5
                      }}
                    >
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'}>
                        <DoubleArrowWrapper
                          onClick={() => {
                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                            onSwitchTokens()
                          }}
                          color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                        >
                          <div>
                            <img src={DoubleArrow} />
                          </div>
                        </DoubleArrowWrapper>

                        {recipient === null && !showWrap && isExpertMode ? (
                          <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                            + Add a send (optional)
                          </LinkStyledButton>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                  </AutoColumn>
                  <CurrencyOutputPanel
                    value={formattedAmounts[Field.OUTPUT]}
                    onUserInput={handleTypeOutput}
                    label={'Swap To'}
                    showMaxButton={false}
                    currency={currencies[Field.OUTPUT]}
                    onCurrencySelect={handleOutputSelect}
                    otherCurrency={currencies[Field.INPUT]}
                    id="swap-currency-output"
                  />

                  {recipient !== null && !showWrap ? (
                    <>
                      <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                        <ArrowWrapper clickable={false}>
                          <ArrowDown size="16" color={theme.text2} />
                        </ArrowWrapper>
                        <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                          - Remove send
                        </LinkStyledButton>
                      </AutoRow>
                      <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                    </>
                  ) : null}

                  {showWrap ? null : (
                    <Card padding={showWrap ? '.25rem 1rem 0 1rem' : '0px'} borderRadius={'20px'}>
                      <AutoColumn gap="8px" style={{ padding: '0px 16px 16px' }}>
                        {Boolean(trade) && (
                          <RowBetween align="center">
                            <Text fontSize={14} fontWeight={500} color={'#fff'}>
                              Price &nbsp;
                            </Text>
                            <TradePrice
                              price={trade?.executionPrice}
                              showInverted={showInverted}
                              setShowInverted={setShowInverted}
                            />
                          </RowBetween>
                        )}
                        {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                          <RowBetween align="center" style={{ justifyContent: 'center' }}>
                            <ClickableText fontSize={14} fontWeight={500} color={'#fff'} onClick={toggleSettings}>
                              Slippage Tolerance &nbsp;
                            </ClickableText>
                            <ClickableText fontSize={14} fontWeight={500} color={'#fff'} onClick={toggleSettings}>
                              {allowedSlippage / 100}%
                            </ClickableText>
                          </RowBetween>
                        )}
                      </AutoColumn>
                    </Card>
                  )}
                </InputWrapper>
                <BottomGrouping>
                  {swapIsUnsupported ? (
                    <ButtonPrimary disabled={true} style={{ textAlign: 'center', background: '#828DB0' }}>
                      <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
                    </ButtonPrimary>
                  ) : !account ? (
                    <ButtonPrimary onClick={toggleWalletModal}>Connect Your Wallet</ButtonPrimary>
                  ) : showWrap ? (
                    <ButtonPrimary
                      disabled={Boolean(wrapInputError)}
                      onClick={onWrap}
                      style={{ textAlign: 'center', background: '#828DB0' }}
                    >
                      {wrapInputError ??
                        (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                    </ButtonPrimary>
                  ) : noRoute && userHasSpecifiedInputOutput ? (
                    <GreyCard style={{ textAlign: 'center', background: '#828DB0' }}>
                      <TYPE.main mb="4px" color={'#D0D8F4'} style={{ fontSize: 18, fontWeight: 600 }}>
                        Insufficient liquidity for this trade.
                      </TYPE.main>
                      {singleHopOnly && (
                        <TYPE.main mb="4px" style={{ color: '#D0D8F4', fontSize: 18, fontWeight: 600 }}>
                          Try enabling multi-hop trades.
                        </TYPE.main>
                      )}
                    </GreyCard>
                  ) : showApproveFlow ? (
                    <RowBetween style={{ gap: 10 }}>
                      <ButtonConfirmed
                        onClick={approveCallback}
                        disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                        width="48%"
                        altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                        confirmed={approval === ApprovalState.APPROVED}
                      >
                        {approval === ApprovalState.PENDING ? (
                          <AutoRow gap="6px" justify="center">
                            Approving <Loader stroke="white" />
                          </AutoRow>
                        ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                          'Approved'
                        ) : (
                          'Approve ' + currencies[Field.INPUT]?.symbol
                        )}
                      </ButtonConfirmed>

                      <ButtonError
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              showConfirm: true,
                              txHash: undefined
                            })
                          }
                        }}
                        width="48%"
                        id="swap-button"
                        disabled={
                          !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                        }
                        error={isValid && priceImpactSeverity > 2}
                      >
                        <Text fontSize={16} fontWeight={500}>
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact High`
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                        </Text>
                      </ButtonError>
                    </RowBetween>
                  ) : (
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap()
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined
                          })
                        }
                      }}
                      id="swap-button"
                      disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                      error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                    >
                      <Text fontSize={20} fontWeight={500}>
                        {swapInputError
                          ? swapInputError
                          : priceImpactSeverity > 3 && !isExpertMode
                          ? `Price Impact Too High`
                          : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                      </Text>
                    </ButtonError>
                  )}
                  {showApproveFlow && (
                    <Column style={{ marginTop: width < 500 ? 0 : '1rem' }}>
                      <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                    </Column>
                  )}
                  {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  {betterTradeLinkV2 && !swapIsUnsupported && toggledVersion === Version.v1 ? (
                    <BetterTradeLink version={betterTradeLinkV2} />
                  ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
                    <DefaultVersionLink />
                  ) : null}
                </BottomGrouping>
                {!swapIsUnsupported ? (
                  <AdvancedSwapDetailsDropdown trade={trade} chainId={chainId} />
                ) : (
                  <UnsupportedCurrencyFooter
                    show={swapIsUnsupported}
                    currencies={[currencies.INPUT, currencies.OUTPUT]}
                  />
                )}
              </div>
            </ApBody>
          </AppWrapper>
          <GraphDiv>
            <UpperSection>
              <OverViewTxt>Overview</OverViewTxt>
            </UpperSection>
            {loading ? (
              <GraphPlaceholder height={100}>
                <Loader />
              </GraphPlaceholder>
            ) : currentPair ? (
              <AutoColumn
                style={{
                  display: width < 500 ? 'block' : 'flex',
                  alignItems: 'baseline',
                  width: '100%'
                  // height: '100%',
                  // borderLeft: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                {/* <div style={{ display: width < 500 ? 'none' : 'flex', width: 'fit-content', paddingLeft: 20 }}>
                  <img src={currentPair.tokenALogo} alt={'tokenAlogo'} width={32} height={32} />
                  <img src={currentPair.tokenBLogo} alt={'tokenBLogo'} width={32} height={32} />
                </div> */}
                <PairGraph
                  tokenAName={currentPair.tokenATicker}
                  tokenBName={currentPair.tokenBTicker}
                  pairAddress={currentPair?.pairAddress}
                  pairData={currentPair}
                />
              </AutoColumn>
            ) : (
              <GraphPlaceholder height={100}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    width: 215,
                    position: 'relative',
                    bottom: width < 1365 ? 0 : 100
                  }}
                >
                  {/* <img src={PairNotFound} alt={'pairNotFound'} width={290} height={200} style={{marginBottom: 24}} /> */}
                  <Text fontWeight={200} fontSize={16} style={{ display: 'flex' }}>
                    Liquidity Pair Not Found
                  </Text>
                  <Text fontWeight={'500'} fontSize={23} style={{ display: 'flex', paddingBottom: 32 }}>
                    Be the first Liquidity Provider
                  </Text>
                  <CreateButton to="/pool"> Create a Pair </CreateButton>{' '}
                </div>
              </GraphPlaceholder>
            )}
          </GraphDiv>
        </ContentWrapper>
        <CopyRight />
      </BodyContent>
    </>
  )
}

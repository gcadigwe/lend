import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { ArrowWrapper, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import { ChainId, CurrencyAmount, JSBI, Token, Trade } from '@spherium/swap-sdk'
import {
  ChainTransferState,
  CrosschainChain,
  setAvailableChains,
  setCrosschainTransferStatus,
  setCurrentToken,
  setSPHRItoETH,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import Column, { AutoColumn } from '../../components/Column'
import { CHAIN_LABELS, SUPPORTED_CHAINS, ETH_RPCS, returnBalanceNum } from '../../constants'
import { Field, selectCurrency } from '../../state/swap/actions'
import {
  getCrosschainState,
  GetTokenByAddress,
  useCrossChain,
  useCrosschainHooks,
  useCrosschainState
} from '../../state/crosschain/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import styled, { ThemeContext } from 'styled-components'
import DoubleArrow from '../../assets/images/double-arrow.svg'

import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'

import AddressInputPanel from '../../components/AddressInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { isBSC } from 'utils/checkBSC'
import { AppDispatch } from '../../state'
import { ArrowDown } from 'react-feather'
import { ExternalLink } from '../../theme'
import BlockchainSelector from '../../components/BlockchainSelector'
import Circle from '../../assets/images/circle-grey.svg'
import Circle2 from '../../assets/images/circle.svg'
import { ClickableText } from '../Pool/styleds'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from './CurrencyInputPanel'
import { CustomLightSpinner } from '../../theme/components'
import SpheriumBridge from '../../assets/images/spheriumBridge.png'

import ArrowUp from '../../assets/images/arrow-up.png'
import Arrowdown from '../../assets/images/arrow-down.png'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import Loader from '../../components/Loader'
import ProgressSteps from '../../components/ProgressSteps'
import { ProposalStatus } from '../../state/crosschain/actions'
import { Text } from 'rebass'
import TokenWarningModal from '../../components/TokenWarningModal'
import TradePrice from '../../components/swap/TradePrice'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import SwapsTabs from '../../components/SwapsTabs'
import Account from '../../components/Account'
import MobileHeader from 'components/MobileHeader'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import CopyRight from 'components/Copyright'
import BridgeHeroImage from '../../assets/images/bridgeHeroImage.svg'
import { crosschainConfigAvaxPoly, crosschainConfigEthBnb, crosschainConfig } from 'constants/CrosschainConfig'
import { formattedNum } from 'utils'
import { addBscMainnetNetwork } from '../../pages/App'
import { addEthNetwork, addAvax, addMatic, addArbi } from '../../components/Header/headertoggle'
import { useMedia } from 'react-use'
import GasFeeCard from './gasFee'

const CrossChainLabels = styled.div`
  p {
    text-align: right;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.5rem;
    margin-bottom: 0;
    font-size: 0.9rem;
    span {
      margin-left: auto;
      font-weight: bold;
    }
  }
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
  overflow-x: hidden;
  //padding: 0px 50px 0px 50px;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
  margin-bottom: 33px;
  overflow: visible;

`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px;
    display: block;

  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    overflow-x: visible;

`};
`
const ApBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

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
  //background-color: ${({ theme }) => theme.bg6};

`};
`
const InputWrapper = styled(AutoColumn)`
  display: block;
  //padding-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  background-color: #0e1218;
  min-height: 185px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 0px;


`};
`
const DoubleArrowWrapper = styled.div`
  z-index: 1;
  height: 0px;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  transform: rotate(90deg);
  :hover {
    cursor: pointer;
  }
`
const GraphDiv = styled.div`
  display: flow-root;
  width: 100%;
  height: 100%;
  background: radial-gradient(940px 909px at center, rgba(52, 56, 91, 0.1), transparent, transparent);

  position: relative;
  max-width: 60%;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-bottom: 170px;
 
  `};
`
const OverViewTxt = styled.p`
  font-weight: 500;
  font-size: 24px;
  width: 35%;
  margin-top: 23px;

  @media (max-width: 845px) {
    display: none;
  }
`

const BottomGrouping = styled.div`
  margin: 1rem 32px;
  padding-bottom: 0px;
  padding-top: 0px;
  justify-content: center;
  display: block;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin: 10px 20px;
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

const RightSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  text-align: center;
  height: 100%;
  justify-content: flex-start;
`

const RightSectionContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  position: relative;
  min-height: 440px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  justify-content: flex-start;
`

const RightSectionImg = styled.div`
  background-image: url(${BridgeHeroImage});
  mix-blend-mode: luminosity;
  background-position: right;
  width: 100%;
  padding: 67px 0px 67px 89px;
  height: 100%;
  border-radius: 20px;
  background-repeat: no-repeat;
  background-size: contain;

  span {
    font-weight: bold;
    font-size: 20px;
    background: linear-gradient(114.61deg, #dbddff 32.4%, rgba(164, 255, 233, 0) 150.98%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  background-position: bottom;
  padding: 31px 71px 55px 36px;
  background-size: cover;
  mix-blend-mode: unset;

  `};
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

const MAXLiqWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 7px 8px 24px;
  background: #f4f6fa;
  border-radius: 0px 0px 8px 8px;
  margin: 1rem;
  margin-top: 0rem;
  color: #616c8e;
  font-weight: 500;
`

export default function CrossChain() {
  const loadedUrlParams = useDefaultsFromURLSearch()

  useCrossChain()

  const {
    currentTxID,
    availableChains: allChains,
    availableTokens,
    currentChain,
    currentToken,
    transferAmount,
    crosschainFee,
    targetChain,
    targetTokens,
    crosschainTransferStatus,
    swapDetails,
    sphriToEth,
    origin,
    currentBalance,
    tvl,
    tokenAmount,
    tokenAmountLocked
  } = useCrosschainState()

  const currentTargetToken = targetTokens.find((x: { assetBase: any }) => x.assetBase === currentToken.assetBase)
  const crosschainState = getCrosschainState()

  const { BreakCrosschainSwap, GetAllowance } = useCrosschainHooks()
  const dispatch = useDispatch<AppDispatch>()

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

  const { account, chainId } = useActiveWeb3React()
  const availableChains = useMemo(() => {
    return allChains?.filter(
      (i: { name: string | undefined }) => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum')
    )
  }, [allChains])

  const theme = useContext(ThemeContext)

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

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currencies[Field.INPUT] ?? undefined,
    chainId
  )

  const tokenBalance: any = currentBalance

  const [sufficientAmount, setSufficientAmount] = useState(false)

  const checkSufficientAmount = (value: any) => {
    // if (tokenBalance !== undefined && parseFloat(tokenBalance) < parseFloat(value)) {
    //   setSufficientAmount(true)
    // } else if (
    //   tokenBalance !== undefined &&
    //   (parseFloat(tokenBalance) > parseFloat(value) || parseFloat(tokenBalance) == parseFloat(value))
    // ) {
    //   setSufficientAmount(false)
    // }
  }

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  // track the input amount, on change, if crosschain, dispatch
  const [inputAmountToTrack, setInputAmountToTrack] = useState('')
  const handleInputAmountChange = useCallback(
    (amount: string) => {
      setInputAmountToTrack(amount)
      checkSufficientAmount(amount)
      dispatch(
        setTransferAmount({
          amount: amount
        })
      )

      dispatch(
        setSPHRItoETH({
          value: (parseFloat(amount) * 0.995).toFixed(3).toString()
        })
      )
    },
    [setInputAmountToTrack, dispatch, checkSufficientAmount]
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      handleInputAmountChange(value)
      checkSufficientAmount(value)
      onUserInput(Field.INPUT, value)
      dispatch(
        setSPHRItoETH({
          value: (parseFloat(value) * 0.995).toFixed(3).toString()
        })
      )
    },
    [onUserInput, handleInputAmountChange, checkSufficientAmount]
  )
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
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

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

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency?.address) {
        const newToken = GetTokenByAddress(inputCurrency.address)
        // console.log(newToken)
        dispatch(
          setCurrentToken({
            token: {
              name: newToken?.name || '',
              address: newToken?.address || '',
              assetBase: newToken?.assetBase || '',
              symbol: newToken?.symbol || '',
              decimals: newToken?.decimals || 18
            }
          })
        )
      }
    },
    [onCurrencySelection, dispatch]
  )

  const handleMaxInput = useCallback(() => {
    if (currentBalance) {
      handleInputAmountChange(currentBalance)
      onUserInput(Field.INPUT, currentBalance)
    }
  }, [maxAmountInput, onUserInput, handleInputAmountChange, currentBalance])

  const [transferChainModalOpen, setShowTransferChainModal] = useState(false)

  const hideTransferChainModal = () => {
    setShowTransferChainModal(false)
    // startNewSwap()
  }

  // not sure we need this
  // const handleMaxInputCrosschain = useCallback(() => {
  //   return currentBalance
  // }, [currentBalance, onUserInput])

  const handleOutputSelect = useCallback(
    outputCurrency => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  useEffect(() => {
    // pre select the token

    handleInputSelect({
      address: account
        ? chainId === ChainId.BSC_MAINNET
          ? '0x8ea93d00cc6252e2bd02a34782487eed65738152'
          : chainId === ChainId.MAINNET
          ? '0x8a0cdfab62ed35b836dc0633482798421c81b3ec'
          : // : chainId === ChainId.ARBITRUM_MAINNET
          // ? '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
          chainId === ChainId.AVALANCHE
          ? '0x2fD4D793c1905D82018d75e3b09d3035856890a1'
          : chainId === ChainId.MATIC
          ? '0x2fD4D793c1905D82018d75e3b09d3035856890a1'
          : ''
        : ''
    } as Token)
  }, [chainId, handleInputSelect, account])

  // swaps or cross chain

  const [isCrossChain, setIsCrossChain] = useState<boolean>(true)
  const handleSetIsCrossChain = (bool: boolean) => {
    setIsCrossChain(bool)

    dispatch(
      setTransferAmount({
        amount: inputAmountToTrack
      })
    )
  }

  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
    // startNewSwap()
  }

  const startNewSwap = () => {
    BreakCrosschainSwap()
  }

  const [showChainBridgeModal, setShowChainBridgeModal] = useState(false)

  const hideChainBridgeModal = () => {
    if (swapDetails?.status === ProposalStatus.EXECUTED || swapDetails?.status === ProposalStatus.CANCELLED) {
      startNewSwap()
    }
    setShowChainBridgeModal(false)
  }

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)

  const showCrossChainModal = () => {
    setShowCrossChainModal(true)
  }

  const hideConfirmTransferModal = () => {
    startNewSwap()
    setConfirmTransferModalOpen(false)
  }

  const onSelectTransferChain = (chain: CrosschainChain) => {
    dispatch(
      setTargetChain({
        chain
      })
    )
  }

  const showTransferChainModal = () => {
    setShowTransferChainModal(true)
  }

  // token transfer state
  const onChangeTransferState = (state: ChainTransferState) => {
    dispatch(
      setCrosschainTransferStatus({
        status: state
      })
    )
    if (state === ChainTransferState.TransferFee && currentTxID.length) {
      BreakCrosschainSwap()
    }
  }

  // const handleConfirmDismiss = useCallback(() => {
  //   setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
  //   // if there was a tx hash, we want to clear the input
  //   if (txHash) {
  //     onUserInput(Field.INPUT, '')
  //   }
  // }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const [confirmTransferModalOpen, setConfirmTransferModalOpen] = useState(false)

  const showConfirmTransferModal = () => {
    GetAllowance()
    setConfirmTransferModalOpen(true)
  }

  // token transfer state

  // const handleAcceptChanges = useCallback(() => {
  //   setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  // }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const getChainName = (): string => {
    if (chainId == ChainId.BSC_MAINNET || chainId == ChainId.BSC_TESTNET) return 'BSC'
    if (!!chainId && chainId in CHAIN_LABELS) {
      return CHAIN_LABELS[chainId] || ''
    }
    return ''
  }
  const handleChainBridgeButtonClick = () => {
    if (crosschainTransferStatus === ChainTransferState.TransferComplete) {
      setShowChainBridgeModal(true)
    } else {
      showConfirmTransferModal()
    }
  }

  useEffect(() => {
    BreakCrosschainSwap()
  }, [])

  const { width } = useWindowDimensions()

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

  const getCurrency = () => {
    if (chainId === 42161 || chainId === 137 || chainId === 43114) return currentToken
    else return currencies[Field.INPUT]
  }

  const currencya = getCurrency()

  function GetAvailableChains(currentChainName: string | any): Array<CrosschainChain> {
    const result: Array<CrosschainChain> = []

    const crosschainState = getCrosschainState()
    if (chainId === 56 || chainId === 1) {
      if (currentToken.name === 'BACKED') {
        for (const chain of crosschainConfigEthBnb.chains) {
          if (chain.name !== currentChainName) {
            result.push({
              name: chain.name,
              chainID: String(chain.chainId)
            })
          }
        }
        return result
      } else {
        for (const chain of crosschainConfig.chains) {
          if (chain.name !== currentChainName) {
            result.push({
              name: chain.name,
              chainID: String(chain.chainId)
            })
          }
        }
        return result
      }
    } else if (currentToken.symbol === 'SPHRI') {
      for (const chain of crosschainConfig.chains) {
        if (chain.name !== currentChainName) {
          result.push({
            name: chain.name,
            chainID: String(chain.chainId)
          })
        }
      }
      return result
    }
    return result
  }

  useEffect(() => {
    const chains = GetAvailableChains(chainId ? CHAIN_LABELS[chainId] : 'Ethereum')

    dispatch(
      setAvailableChains({
        chains: chains
      })
    )
  }, [chainId, currentToken])

  const changeChain = () => {
    const targetchain = crosschainState.targetChain?.chainID
    if (targetChain !== undefined) {
      if (targetchain === '56') {
        addBscMainnetNetwork()
      }
      if (targetchain === '1') {
        addEthNetwork()
      }
      if (targetchain === '137') {
        addMatic()
      }
      if (targetchain === '43114') {
        addAvax()
      }
    }
  }

  return (
    <>
      <BodyContent>
        <TokenWarningModal
          isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
          tokens={urlLoadedTokens}
          onConfirm={handleConfirmTokenWarning}
        />
        {chainId && (
          <ContentWrapper>
            <AppWrapper>
              <ApBody>
                {/* <MobileHeader /> */}
                <RowBetween
                  style={{
                    gap: width < 500 ? 0 : 12,
                    position: 'relative',
                    top: width < 500 ? '-8px' : '26.5px',
                    paddingBottom: 22,
                    paddingLeft: width < 500 ? 20 : 32,
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
                    <span style={{ fontSize: width < 500 ? 18 : 24, fontWeight: 500 }}>Bridge</span>
                    <span
                      style={{
                        justifyContent: 'end',
                        position: 'relative',
                        top: width < 500 ? '0px' : '6px',
                        width: '100%',
                        fontWeight: 500,
                        fontSize: 12,
                        opacity: 0.6,
                        left: 12
                      }}
                    >
                      Gateway to Cross-Chain Interoperability
                    </span>
                  </div>
                </RowBetween>
                <CrossChainModal
                  isOpen={crossChainModalOpen}
                  onDismiss={hideCrossChainModal}
                  supportedChains={availableChains}
                  selectTransferChain={() => ''}
                  activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
                />
                <CrossChainModal
                  isOpen={transferChainModalOpen}
                  onDismiss={hideTransferChainModal}
                  supportedChains={availableChains}
                  isTransfer={true}
                  selectTransferChain={onSelectTransferChain}
                  activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
                />
                <ConfirmTransferModal
                  isOpen={confirmTransferModalOpen}
                  onDismiss={hideConfirmTransferModal}
                  transferTo={targetChain}
                  activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
                  changeTransferState={onChangeTransferState}
                  tokenTransferState={crosschainTransferStatus}
                  value={formattedAmounts[Field.INPUT]}
                  currency={currencies[Field.INPUT]}
                  trade={trade}
                />

                <SwapsTabs isCrossChain={true} onSetIsCrossChain={handleSetIsCrossChain} />
                <div
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    opacity: !isCrossChain || crosschainTransferStatus === ChainTransferState.TransferFee ? '1' : '.5',
                    pointerEvents:
                      !isCrossChain || crosschainTransferStatus === ChainTransferState.TransferFee ? 'auto' : 'none',
                    filter:
                      !isCrossChain || crosschainTransferStatus === ChainTransferState.TransferFee ? '' : 'blur(3px)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      margin: width < 500 ? 20 : '32px',
                      marginTop: width < 500 ? 0 : '1rem',
                      borderRadius: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', width: '100%', padding: '24px 0px', flexDirection: 'row-reverse' }}>
                      {account && formattedAmounts[Field.INPUT] && (
                        <>
                          {/* <CrossChainLabels> */}
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              marginBottom: 0,
                              display: 'grid',
                              width: '50%',
                              textAlign: 'end',
                              marginRight: 20,
                              lineHeight: '20px',
                              gap: 10
                            }}
                          >
                            <span>
                              <span style={{ color: '#fff' }}>{sphriToEth}</span>
                              &nbsp;
                              {currentToken.symbol}
                            </span>
                            <span style={{ opacity: 0.6, fontSize: 12 }}> You will receive:</span>
                          </p>
                          {/* </CrossChainLabels> */}
                        </>
                      )}

                      <BlockchainSelector
                        isCrossChain={isCrossChain}
                        supportedChains={SUPPORTED_CHAINS}
                        blockchain={chainId ? CHAIN_LABELS[chainId] : undefined}
                        transferTo={targetChain}
                        onShowCrossChainModal={showCrossChainModal}
                        onShowTransferChainModal={showTransferChainModal}
                      />
                    </div>
                    <InputWrapper>
                      <CurrencyInputPanel
                        blockchain={isCrossChain ? currentChain.name : getChainName()}
                        label={'From'}
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        currency={currencya}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={currencies[Field.OUTPUT]}
                        isCrossChain={isCrossChain}
                        id="swap-currency-input"
                      />

                      <AutoColumn justify="space-between">
                        <AutoRow justify={isExpertMode ? 'space-between' : 'center'}>
                          {recipient === null && !showWrap && isExpertMode ? (
                            <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                              + Add a send (optional)
                            </LinkStyledButton>
                          ) : null}
                        </AutoRow>
                      </AutoColumn>
                      <DoubleArrowWrapper onClick={changeChain}>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: width < 500 ? 0 : 40 }}>
                          <img src={DoubleArrow} />
                        </div>
                      </DoubleArrowWrapper>
                    </InputWrapper>
                  </div>
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
                  <div>
                    {/* {showWrap ? null : (
                    <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                      {!isCrossChain && (
                        <AutoColumn gap="4px">
                          {Boolean(trade) && (
                            <RowBetween align="center">
                              <Text fontWeight={500} fontSize={14} color={theme.text2}>
                                Price
                              </Text>
                              <TradePrice
                                price={trade?.executionPrice}
                                showInverted={showInverted}
                                setShowInverted={setShowInverted}
                              />
                            </RowBetween>
                          )}
                          {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                            <RowBetween align="center">
                              <ClickableText
                                fontWeight={500}
                                fontSize={14}
                                color={theme.text2}
                                onClick={toggleSettings}
                              >
                                Slippage Tolerance
                              </ClickableText>
                              <ClickableText
                                fontWeight={500}
                                fontSize={14}
                                color={theme.text2}
                                onClick={toggleSettings}
                              >
                                {allowedSlippage / 100}%
                              </ClickableText>
                            </RowBetween>
                          )}
                        </AutoColumn>
                      )}
                    </Card>
                  )} */}
                  </div>
                  <div>
                    <BottomGrouping>
                      {/* <Text style={{ fontWeight: 500, textAlign: 'center', marginBottom: 20 }}>
                        Transfer Mode Spherium PoS Bridge
                      </Text>
                          display: flex;
                          background: rgba(255, 255, 255, 0.03);
                          padding: 24px 14px;
                          border-radius: 8px;
                          min-height: 68px; */}

                      <GasFeeCard />
                      {showApproveFlow && (
                        <Column style={{ marginTop: '1rem' }}>
                          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                        </Column>
                      )}
                      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}

                      {!account ? (
                        <ButtonPrimary onClick={toggleWalletModal}>Connect Your Wallet</ButtonPrimary>
                      ) : !Number(crosschainFee) && targetChain && transferAmount ? (
                        <ButtonError disabled={true} error={true}>
                          <Text fontSize={20} fontWeight={500}>
                            Insufficient liquidity
                          </Text>
                        </ButtonError>
                      ) : sufficientAmount === true && isCrossChain ? (
                        <ButtonError disabled={true} error={true}>
                          <TYPE.white fontSize={20} fontWeight={500}>
                            Insufficient liquidity for this trade.
                          </TYPE.white>
                        </ButtonError>
                      ) : isCrossChain && targetChain && transferAmount.length && transferAmount !== '0' ? (
                        <>
                          <ButtonPrimary onClick={showConfirmTransferModal}>
                            Transfer {currentToken?.symbol} Tokens to {targetChain?.name}
                          </ButtonPrimary>
                        </>
                      ) : showApproveFlow ? (
                        <RowBetween>
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
                              !isValid ||
                              approval !== ApprovalState.APPROVED ||
                              (priceImpactSeverity > 3 && !isExpertMode)
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
                    </BottomGrouping>
                  </div>
                </div>
              </ApBody>
            </AppWrapper>
            <GraphDiv>
              <div
                style={{
                  display: 'grid',
                  height: '100%',
                  margin:
                    width < 1366 && width > 500 ? '0px 38px 0px 38px' : width < 500 ? '0px 20px' : '68px 38px 0px 0px'
                }}
              >
                <RightSectionWrapper>
                  <RightSectionContent>
                    <RightSectionImg>
                      <Text
                        fontWeight={500}
                        fontSize={24}
                        style={{ display: 'flex', paddingBottom: 10, width: '100%' }}
                      >
                        HyperBridge
                      </Text>

                      <Text
                        fontWeight={500}
                        fontSize={width < 500 ? 12 : 16}
                        style={{ display: 'flex', width: '100%', opacity: 0.6, textAlign: 'left' }}
                      >
                        A safe, fast and secure way to bridge assets cross-chain in an instant.
                      </Text>

                      <RowBetween
                        style={{
                          display: 'grid',
                          gap: 20,
                          justifyContent: 'flex-start',
                          marginTop: 20,
                          textAlign: 'left'
                        }}
                      >
                        <ExternalLink
                          href={'https://drive.google.com/file/d/1Z4nN9jYDt-HjR7VTgD1Jh8wW4-6vCAZi/view'}
                          style={{
                            textDecoration: 'none',
                            color: '##5667FF',
                            fontSize: 16,
                            fontWeight: 700
                          }}
                        >
                          How it Works?
                        </ExternalLink>
                        <ExternalLink
                          href={'https://spherium.finance/#/faq'}
                          style={{
                            textDecoration: 'none',
                            color: '##5667FF',
                            fontSize: 16,
                            fontWeight: 700
                          }}
                        >
                          FAQ
                        </ExternalLink>

                        <ExternalLink
                          href={'https://spherium.finance/#/documentation'}
                          style={{
                            textDecoration: 'none',
                            color: '##5667FF',
                            fontSize: 16,
                            fontWeight: 700
                          }}
                        >
                          User Guide
                        </ExternalLink>
                      </RowBetween>
                      <Text
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontWeight: 400,
                          textAlign: 'left',
                          fontSize: 12,
                          marginBottom: 20,
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          paddingTop: 45
                        }}
                      >
                        Total Value Locked <span>{formattedNum(tvl, true)}</span>
                      </Text>
                      <Text
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontWeight: 400,
                          textAlign: 'left',
                          fontSize: 12,
                          display: 'flex',
                          flexDirection: 'column-reverse'
                        }}
                      >
                        {tokenAmount.map((t: any, idx: number) => {
                          return (
                            <React.Fragment key={t.address}>
                              {idx == 0 && 'Maximum Available Amount '}
                              <span>
                                {t.name} {formattedNum(t.numberOfTokens)}
                              </span>
                            </React.Fragment>
                          )
                        })}
                      </Text>
                    </RightSectionImg>
                  </RightSectionContent>
                </RightSectionWrapper>
              </div>
            </GraphDiv>
          </ContentWrapper>
        )}
        <CopyRight />
      </BodyContent>
    </>
  )
}
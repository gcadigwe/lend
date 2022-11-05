import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { ArrowWrapper, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import { ChainId, CurrencyAmount, JSBI, Token, Trade } from '@spherium/swap-sdk'

import { CardContainer, CardBackground } from './Popupstyle'

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
// import CurrencyInputPanel from './CurrencyInputPanel'
import { CustomLightSpinner } from '../../theme/components'
import SpheriumBridge from '../../assets/images/spheriumBridge.png'

import ArrowUp from '../../assets/images/arrow-up.png'
import Arrowdown from '../../assets/images/arrow-down.png'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'

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
import { Toggle } from 'react-toggle-component'
import SearchIcon from '../../assets/images/cards/search.svg'
import Headerlogo from '../../assets/images/cards/headerlogo.svg'
import BtcEthlogo from '../../assets/images/cards/Btc-ethlogo.svg'
import Etherumlogo from '../../assets/images/cards/Ethlogo.svg'
import Filecoil from '../../assets/images/cards/File-coil.svg'
import USDTLogo from '../../assets/images/cards/usdt.svg'
import CardModal from './CardModal'
// import { PopupModal } from './PopupModal'
import useMetamaskConnectionStatus from '../../contracts/hooks/useMetamaskConnectionStatus'

import Loader from './loader/Loader'
const LowerWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  grid-gap: 24px;
  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
`
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

  padding: 13px 75px 0px 75px;
  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
    padding: 10px;
  }

  ${({ theme }) => theme.mediaWidth.upToNormal`
  display: grid;
  overflow: visible;


`};
`
export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 20px;
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

  height: inherit;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  grid-template-rows: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  `};

  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
  }
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
export const UpperContainer = styled.div`
  display: flex;
  background: linear-gradient(89.59deg, rgba(133, 162, 189, 0.3) 0.51%, rgba(174, 189, 132, 0.3) 104.04%);

  align-items: center;
  justify-content: space-between;
  padding-left: 75px
  padding-right: 75px

  height: 100px;
 
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
   height: 365px;
   width: 80%


   padding-left: 40px;
  padding-right: 0px;
  padding-top: 20px;
  padding-bottom: 20px;

   
    flex-direction: column;
    align-items: flex-start;

    margin-bottom: 22px;
    margin-top: 22px;
    border-radius: 12px;
  }
`

export const UpperContainerWrapper = styled.div`
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    display: flex;
    justify-content: center;
  }
`

export const UpperMobileContainer = styled.div`
  display: none;

  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    display: flex;
    flex-direction: column;

    margin-bottom: 20px;
  }
`
export const UpperRow1 = styled.div`
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    width: auto;
    display: flex;
    justify-content: space-between;
  }
`

export const LowerRow2 = styled.div`
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    display: grid;
    grid-template-columns: 8fr 4fr;
    grid-gap: 20px;
  }
`
export const StakingHead = styled.h4`
  cursor: pointer;
  margin-right: 60px;
  width: 84px;
  height: 30px;
  left: 292px;
  top: 112px;
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 30px;
  letter-spacing: 0.113382px;
  color: #ffffff;
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
  }
`
export const AllboxLpwrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 18px;
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    position: relative;
    top: 48px;
  }
`
export const Allbox = styled.div`
  border: 1px solid gray;
  border-radius: 6px;
  padding: 5px 12px;
  margin-right: 10px;
  width: 38px;
  height: 30px;
  left: 400px;
  top: 112px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);

  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 12px;
  gap: 10px;
  :hover {
    background: gray;
    color: #fff;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
  }
`
export const Assetbox = styled.div`
  margin-right: 10px;
  cursor: pointer;
  width: 58px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid gray;
  height: 30px;
  left: 400px;
  top: 112px;
  display: flex;
  border-radius: 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 12px;
  gap: 10px;
  :hover {
    background: gray;
    color: #fff;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
  }
`
export const LpBox = styled.div`
  margin-right: 10px;
  border-radius: 6px;
  border: 1px solid gray;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  width: 28px;
  height: 30px;
  left: 400px;
  top: 112px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  :hover {
    background: gray;
    color: #fff;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    margin-right: 0px;
  }
`
export const AssetboxContain = styled.div`
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
  }
`

export const AllBoxContain = styled.div`
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
  }
`

export const LpContain = styled.div`
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
  }
`

export const SearchBarContainer = styled.form`
  margin-right: 107px;
  width: 100%;
  height: 39px;
  background: rgb(114 108 108 / 45%);
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  gap: 12px;
  placeholder='Search Assets/Lp By name or symbol'
    @media
    only
    screen
    and
    (min-device-width: 320px)
    and
    (max-device-width: 426px)
    and
    (orientation: portrait) {
  }
`
export const SearchLogo = styled.img`
  width: 12px;
  height: 12px;
  left: 7px;
  top: 7px;
`
export const SearchBarContain = styled.input`
  width: 100%;
  height: 18px;
  color: rgba(255, 255, 255, 0.4);
  background-color: transparent;
  border-color: transparent;
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;
  /* identical to box height, or 180% */
  placeholder="search assets/lp by name or symbol"display: flex;
  align-items: center;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  &:focus,
  &:active {
    outline: none;
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  :hover {
    color: #fff;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    width: 100%;
  }
`
export const ToggleContainer = styled.div`
  cursor: pointer;

  display: inherit;

  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const ShowContain = styled.div`
  font-size: 19px;
  /* Label/Label_Small */

  font-family: 'General Sans';
  font-style: normal;
  font-weight: 500;

  line-height: 20px;
  /* identical to box height, or 143% */

  /* Grey Scale/Grey_500 */

  color: #96909f;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  @media only screen and (min-device-width: 320px) and (max-device-width: 426px) and (orientation: portrait) {
    height: 20px;
    font-size: 14px;
    font-family: 'General Sans';
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: #96909f;
  }
`

const CheckBoxWrapper = styled.div`
  position: relative;
`
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  margin-left: 11px;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 99px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`

const Squareshape = styled.div`
  background: linear-gradient(89.59deg, rgba(133, 162, 189, 0.3) 0.51%, rgba(174, 189, 132, 0.3) 104.04%);
  width: 40px;
  height: 40px;
  border-radius: 8px;
`

const HeaderTextBig = styled.text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  margin-bottom: 6px;
`

const HeaderTextSmall = styled.text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px
  font-weight: 400
  opacity: 0.6
`

const HeaderTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

const ValueItemContainer = styled.div`
  display: flex;
  align-items: center;
`

const SwitchTextContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }
`

const SwitchText = styled.text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
`

export default function Lending() {
  const loadedUrlParams = useDefaultsFromURLSearch()

  const [currentPage, setcurrentPage] = useState('lending')

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

  const [selectTab, setSelectTab] = useState(1)
  const currentTargetToken = targetTokens.find((x: { assetBase: any }) => x.assetBase === currentToken.assetBase)
  const crosschainState = getCrosschainState()
  const [Popupmodalse, setPopmodal] = useState(false)
  const { BreakCrosschainSwap, GetAllowance } = useCrosschainHooks()
  const dispatch = useDispatch<AppDispatch>()
  const OpenModal = () => {
    setPopmodal(!Popupmodalse)
  }
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
  const toggleWalletModal = useWalletModalToggle()
  // toggle wallet when disconnected

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  // const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const {
    isMetamaskConnected,
    setIsMetamaskConnected
    // showWrongNetworkPrompt,
  } = useMetamaskConnectionStatus()
  console.log('connection', isMetamaskConnected, account)

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

  const setShowPopup = () => {
    toggleWalletModal()
  }

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

  const [loading, setLoading] = useState(false)

  return (
    <>
      <BodyContent style={{ zIndex: 2 }}>
        <TokenWarningModal
          isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
          tokens={urlLoadedTokens}
          onConfirm={handleConfirmTokenWarning}
        />
        {chainId && (
          <>
            <UpperContainerWrapper>
              <UpperContainer>
                <ValueItemContainer>
                  <Squareshape />
                  <HeaderTextContainer>
                    <HeaderTextBig>103,493,90 USD</HeaderTextBig>
                    <HeaderTextSmall>Total Value Locked (TVL)</HeaderTextSmall>
                  </HeaderTextContainer>
                </ValueItemContainer>
                <ValueItemContainer>
                  <Squareshape />
                  <HeaderTextContainer>
                    <HeaderTextBig>103,493,90 USD</HeaderTextBig>
                    <HeaderTextSmall>Total Supplied</HeaderTextSmall>
                  </HeaderTextContainer>
                </ValueItemContainer>
                <ValueItemContainer>
                  <Squareshape />
                  <HeaderTextContainer>
                    <HeaderTextBig>2,453.000</HeaderTextBig>
                    <HeaderTextSmall>Total Borrowed</HeaderTextSmall>
                  </HeaderTextContainer>
                </ValueItemContainer>
                <ValueItemContainer>
                  <Squareshape />
                  <HeaderTextContainer>
                    <HeaderTextBig>103,493,90 USD</HeaderTextBig>
                    <HeaderTextSmall>Repay Balance</HeaderTextSmall>
                  </HeaderTextContainer>
                </ValueItemContainer>
                <ValueItemContainer>
                  <Squareshape />
                  <HeaderTextContainer>
                    <HeaderTextBig>40%</HeaderTextBig>
                    <HeaderTextSmall>Borrow Limit</HeaderTextSmall>
                  </HeaderTextContainer>
                </ValueItemContainer>
              </UpperContainer>
            </UpperContainerWrapper>
            <ContentWrapper>
              <Loader open={loading} />
              <SwitchTextContainer>
                <SwitchText
                  onClick={() => {
                    if (currentPage !== 'lending') {
                      setcurrentPage('lending')
                    }
                  }}
                  style={{
                    marginRight: '16px',
                    cursor: 'pointer',
                    color: currentPage === 'lending' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'
                  }}
                >
                  Lending Pool
                </SwitchText>
                <SwitchText
                  onClick={() => {
                    if (currentPage !== 'borrowing') {
                      setcurrentPage('borrowing')
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    color: currentPage === 'borrowing' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'
                  }}
                >
                  Borrowing Pool
                </SwitchText>
              </SwitchTextContainer>

              <LowerWrapper>
                <CardModal
                  img={Headerlogo}
                  mainhead="Bitcoin BTC"
                  tagline="Pool Value:  15.973 M USD"
                  apr="32.65% APR"
                  eachrow1Value1="Colaterization"
                  eachrow1Value2="toggle-1"
                  eachrow2Value1="Your supplied"
                  eachrow2Value2="0.00 SPHRI"
                  eachrow3Value1="Interest Rate"
                  eachrow3Value2="24 days"
                  buttonhead="Stake Asset"
                  setShowPopup={setShowPopup}
                />

                <CardModal
                  img={Etherumlogo}
                  mainhead="Ethereum ETH"
                  tagline="Pool Value:  15.973 M USD"
                  apr="32.65% APR"
                  eachrow1Value1="Total staked"
                  eachrow1Value2="toggle-2"
                  eachrow2Value1="Your supplied"
                  eachrow2Value2="0.00 SPHRI"
                  eachrow3Value1="Interest Rate"
                  eachrow3Value2="24 days"
                  buttonhead="Manage Asset"
                  setShowPopup={setShowPopup}
                />

                <CardModal
                  img={USDTLogo}
                  mainhead="Tether USDT"
                  tagline="Pool Value:  15.973 M USD"
                  apr="32.65% APR"
                  eachrow1Value1="Total staked"
                  eachrow1Value2="toggle-3"
                  eachrow2Value1="Your supplied"
                  eachrow2Value2="0.00 SPHRI"
                  eachrow3Value1="Interest Rate"
                  eachrow3Value2="24 days"
                  buttonhead="Staked Asset"
                  setShowPopup={setShowPopup}
                />

                <CardModal
                  img={Etherumlogo}
                  mainhead="Ethereum ETH"
                  tagline="Pool Value:  15.973 M USD"
                  apr="32.65% APR"
                  eachrow1Value1="Total staked"
                  eachrow1Value2="toggle-4"
                  eachrow2Value1="Your supplied"
                  eachrow2Value2="0.00 SPHRI"
                  eachrow3Value1="Interest Rate"
                  eachrow3Value2="flexible"
                  buttonhead="Staked Asset"
                  setShowPopup={setShowPopup}
                />

                <CardModal
                  img={Headerlogo}
                  mainhead="Bitcoin BTC"
                  tagline="Pool Value:  15.973 M USD"
                  apr="32.65% APR"
                  eachrow1Value1="Total staked"
                  eachrow1Value2="toggle-5"
                  eachrow2Value1="Your supplied"
                  eachrow2Value2="0.00 SPHRI"
                  eachrow3Value1="Interest Rate"
                  eachrow3Value2="24 days"
                  buttonhead="Staked Asset"
                  setShowPopup={setShowPopup}
                />

                <CardModal
                  img={USDTLogo}
                  mainhead="Tether USDT"
                  tagline="Pool Value:  15.973 M USD"
                  apr="32.65% APR"
                  eachrow1Value1="Total staked"
                  eachrow1Value2="toggle-6"
                  eachrow2Value1="Your supplied"
                  eachrow2Value2="0.00 SPHRI"
                  eachrow3Value1="Interest Rate"
                  eachrow3Value2="24 days"
                  buttonhead="Staked Asset"
                  setShowPopup={setShowPopup}
                />
              </LowerWrapper>
            </ContentWrapper>
          </>
        )}
        <CopyRight />
      </BodyContent>
    </>
  )
}

import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import {
  Currency,
  currencyEquals,
  ETHER,
  Percent,
  WETH,
  BNB,
  AVAX,
  MATIC,
  ChainId,
  JSBI,
  Pair
} from '@spherium/swap-sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown, Plus, X } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonPrimary, ButtonLight, ButtonError, ButtonConfirmed } from '../../components/Button'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { FixedHeightRow, MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import Slider from '../../components/Slider'
import CurrencyLogo from '../../components/CurrencyLogo'
import { BIG_INT_ZERO, ROUTER_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, MaxButton, Wrapper } from '../Pool/styleds'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { Dots } from '../../components/swap/styleds'
import { useBurnActionHandlers } from '../../state/burn/hooks'
import { useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'
import { Field } from '../../state/burn/actions'
import { useWalletModalToggle } from '../../state/application/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs, useUserSlippageTolerance } from '../../state/user/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { useMedia } from 'react-use'
import { usePairs } from 'data/Reserves'
import { useUserHasLiquidityInAllTokens } from 'data/V1'
import { useStakingInfo } from 'state/stake/hooks'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import NumericalInput from 'components/NumericalInput'

const UpperSection = styled.div`
  align-items: center;
  width: 100%;
  justify-content: space-between;
  display: flex;
  height: 84px;
  padding-left: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

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
  //overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  display: grid;
  overflow: visible;


`};
`
const ApBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  //padding-top: 33px;

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
  padding: 1rem;
`};
`
const AppWrapper = styled.div`
  width: 100%;
  border-left: none;
  height: 100%;
  max-width: 40%;
  justify-content: end;
  display: contents;
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

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

export default function RemoveLiquidity({
  currencyIdA,
  currencyIdB,
  updateCurrencyA,
  updateCurrencyB
}: {
  currencyIdB: Currency | any
  currencyIdA: Currency | any
  updateCurrencyA: (newCurreny: Currency | any) => void
  updateCurrencyB: (newCurreny: Currency | any) => void
}) {
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [
    currencyA,
    currencyB,
    chainId
  ])

  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)

  const isArgentWallet = useIsArgentWallet()
  const [showFinder, setShowFinder] = useState(false)
  const [isPooled, setIsPooled] = useState<boolean | undefined>(false)

  const showFinderHandler = () => {
    setShowFinder(true)
  }

  const handlePool = () => {
    setIsPooled(true)
  }

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (isArgentWallet) {
      return approveCallback()
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Spherium',
      version: '1',
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null)
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback((typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue), [
    onUserInput
  ])
  const onCurrencyAInput = useCallback((typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue), [
    onUserInput
  ])
  const onCurrencyBInput = useCallback((typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue), [
    onUserInput
  ])

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER || currencyB === BNB || currencyB === MATIC || currencyB === AVAX
    const oneCurrencyIsETH =
      currencyA === ETHER ||
      currencyA === AVAX ||
      currencyA === BNB ||
      currencyA === MATIC ||
      currencyB === ETHER ||
      currencyB === BNB ||
      currencyB === AVAX ||
      currencyB === MATIC

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString()
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString()
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch(error => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Remove ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencyA?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencyB?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/')
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)
        })
    }
  }

  function modalHeader() {
    return (
      <AutoColumn
        gap={'md'}
        style={{
          marginTop: '20px',
          borderRadius: 8,
          padding: 24,
          display: 'grid',
          margin: '1rem',
          backgroundImage: 'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)'
        }}
      >
        <RowBetween align="flex-end" style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
          <Text
            fontSize={24}
            fontWeight={500}
            width={'100%'}
            margin={'0px 0px 0px 10px'}
            style={{ justifyContent: 'flex-end', display: 'flex' }}
          >
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
          <RowFixed width={'60%'} marginRight={'10px'}>
            <CurrencyLogo currency={currencyA} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currencyA?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus size="16" />
        </RowFixed>
        <RowBetween align="flex-end" style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
          <Text
            fontSize={24}
            fontWeight={500}
            width={'100%'}
            margin={'0px 0px 0px 10px'}
            style={{ justifyContent: 'flex-end', display: 'flex' }}
          >
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
          <RowFixed width={'60%'} marginRight={'10px'}>
            <CurrencyLogo currency={currencyB} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currencyB?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        {/* <TYPE.italic
          fontSize={12}
          color={theme.text2}
          textAlign="left"
          padding={'12px 0 0 0'}
          margin={'0px 0px 0px 5px'}
        >
          {`Output is estimated. If the price changes by more than ${allowedSlippage /
            100}% your transaction will revert.`}
        </TYPE.italic> */}
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          {/* <Text color={theme.text2} fontWeight={500} fontSize={16} width={'100%'}>
            {' ' + currencyA?.symbol + '/' + currencyB?.symbol} Burned
          </Text> */}
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} />
            <Text fontWeight={500} fontSize={14} style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween style={{ marginTop: 20 }}>
              <Text fontWeight={500} fontSize={14} width={'50%'}>
                Price
              </Text>
              <Text
                fontWeight={500}
                fontSize={14}
                
                style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
              >
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text
                fontWeight={500}
                fontSize={14}
                
                style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
              >
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <ButtonPrimary
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
          style={{ marginTop: 20 }}
        >
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencyA?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsETH =
    currencyA === ETHER ||
    currencyA === AVAX ||
    currencyB === ETHER ||
    currencyB === BNB ||
    currencyB === AVAX ||
    currencyB === MATIC ||
    currencyA === BNB ||
    currencyA === MATIC
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        //history.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
        updateCurrencyA(currencyIdA)
      } else {
        //history.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
        updateCurrencyB(currencyIdB)
      }
    },
    [currencyIdA, currencyIdB]
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        //history.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
        updateCurrencyA(currencyIdB)
      } else {
        updateCurrencyA(currencyIdA ? currencyIdA : 'BNB')
        //history.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  )
  const below500 = useMedia('(max-width: 500px)')
  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  return (
    <>
      <ContentWrapper>
        <AppWrapper>
          <ApBody>
            <AppBody>
              <AddRemoveTabs creating={false} adding={false} />
              <Wrapper>
                <TransactionConfirmationModal
                  isOpen={showConfirm}
                  onDismiss={handleDismissConfirmation}
                  attemptingTxn={attemptingTxn}
                  hash={txHash ? txHash : ''}
                  content={() => (
                    <ConfirmationModalContent
                      title={'You will receive'}
                      onDismiss={handleDismissConfirmation}
                      topContent={modalHeader}
                      bottomContent={modalBottom}
                    />
                  )}
                  pendingText={pendingText}
                />
                <AutoColumn gap="md" style={{ display: 'block', margin: '0rem 1rem 2.5rem' }}>
                  <FixedHeightRow
                    style={{
                      height: 98,
                      backgroundImage:
                        'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)',
                      marginBottom: 24,
                      borderRadius: 8
                    }}
                  >
                    <RowFixed marginLeft={25}>
                      <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} size={20} />
                      <RowFixed
                        style={{ display: 'grid', textAlign: 'left', justifyContent: 'flex-start', marginLeft: 13 }}
                      >
                        <Text fontWeight={500} fontSize={14} color={'#616C8E'}>
                          Your position
                        </Text>
                        <Text fontWeight={500} fontSize={18}>
                          {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                          &nbsp;
                          {currencyA?.symbol}-{currencyB?.symbol}
                        </Text>
                      </RowFixed>
                    </RowFixed>
                  </FixedHeightRow>

                  <AutoColumn gap="20px" style={{ display: 'block' }}>
                    {/* <RowBetween > */}
                    {/* <Text fontSize={18} fontWeight={500} color={'#2A324A'}>
                      Enter Withdraw Amount
                      </Text>
                      <InputWrapper>
                      <NumericalInput
                      className="token-amount-input"
                      value={(parseFloat(formattedAmounts[Field.CURRENCY_A]) + parseFloat(formattedAmounts[Field.CURRENCY_B]))}
                      onUserInput={onCurrencyAInput}
                      /> */}
                    {/* {account && currency && showMaxButton && label !== ' Swap To ' && (
                        <StyledBalanceMax onClick={onMax}>Max</StyledBalanceMax>
                      )} */}
                    {/* </InputWrapper> */}

                    {/* </RowBetween> */}
                    {/* <Row style={{ alignItems: 'flex-end' }}>
                  <Text fontSize={72} fontWeight={500}>
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </Text>
                </Row> */}
                    {!showDetailed && (
                      <>
                        <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                        <RowBetween style={{ justifyContent: 'center' }}>
                          <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')} width="20%">
                            25%
                          </MaxButton>
                          <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')} width="20%">
                            50%
                          </MaxButton>
                          <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')} width="20%">
                            75%
                          </MaxButton>
                          <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')} width="20%">
                            Max
                          </MaxButton>
                        </RowBetween>
                      </>
                    )}
                  </AutoColumn>

                  {!showDetailed && (
                    <>
                      {/* <LightCard> */}
                      <AutoColumn
                        gap="10px"
                        style={{
                          justifyContent: 'normal',
                          marginTop: 65,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          paddingBottom: 24
                        }}
                      >
                        <Text fontSize={14} fontWeight={500}>
                          Receive Amount
                        </Text>
                        <RowBetween style={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
                          <Text
                            fontSize={16}
                            fontWeight={500}
                            width={'60%'}
                            display={'flex'}
                            justifyContent={'flex-end'}
                          >
                            {formattedAmounts[Field.CURRENCY_A] || '-'}
                          </Text>
                          {/* @Todo -- Ahmed */}
                          <RowFixed width={'0%'}>
                            <CurrencyLogo currency={currencyA} style={{ marginRight: '12px', height: 22, width: 22 }} />
                            <Text fontSize={16} fontWeight={500} id="remove-liquidity-tokena-symbol">
                              {currencyA?.symbol}
                            </Text>
                          </RowFixed>
                        </RowBetween>
                        <RowBetween style={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
                          <Text
                            fontSize={16}
                            fontWeight={500}
                            width={'60%'}
                            display={'flex'}
                            justifyContent={'flex-end'}
                          >
                            {formattedAmounts[Field.CURRENCY_B] || '-'}
                          </Text>
                          <RowFixed width={'0%'}>
                            <CurrencyLogo currency={currencyB} style={{ marginRight: '12px', height: 22, width: 22 }} />
                            <Text fontSize={16} fontWeight={500} id="remove-liquidity-tokenb-symbol">
                              {currencyB?.symbol}
                            </Text>
                          </RowFixed>
                        </RowBetween>
                        {/* {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                      <RowBetween style={{ justifyContent: 'flex-end' }}>
                        {oneCurrencyIsETH ? (
                          <StyledInternalLink
                            to={`/remove/${
                              currencyA === ETHER || currencyA === BNB || currencyA === MATIC ? WETH[chainId].address : currencyIdA
                            }/${currencyB === ETHER || currencyB === BNB || currencyB === MATIC ? WETH[chainId].address : currencyIdB}`}
                          >
                            {chainId &&
                              (chainId === ChainId.MAINNET ||
                                chainId === ChainId.RINKEBY ||
                                chainId === ChainId.GÖRLI ||
                                chainId === ChainId.KOVAN ||
                                chainId === ChainId.ROPSTEN) &&
                              'Receive WETH'}
                            {chainId &&
                              (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) &&
                              'Receive WBNB'}
                            {chainId &&
                              (chainId === ChainId.MATIC || chainId === ChainId.MUMBAI) &&
                              'Receive WMATIC'}

                          </StyledInternalLink>
                        ) : oneCurrencyIsWETH ? (
                          <StyledInternalLink
                            to={`/remove/${
                              currencyA?.symbol === 'WBNB' && currencyEquals(currencyA, WETH[chainId]) ? 'BNB' : currencyIdA
                              ? currencyA?.symbol === 'WETH' && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA
                              : currencyA?.symbol === 'WMATIC' && currencyEquals(currencyA, WETH[chainId]) ? 'MATIC' : currencyIdA
                            }/${currencyB?.symbol === 'WBNB' && currencyEquals(currencyB, WETH[chainId]) ? 'BNB' : currencyIdB
                            ? currencyB?.symbol === 'WETH' && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB
                            : currencyA?.symbol === 'WMATIC' && currencyEquals(currencyA, WETH[chainId]) ? 'MATIC' : currencyIdA}`}
                          >
                            {chainId &&
                              (chainId === ChainId.MAINNET ||
                                chainId === ChainId.RINKEBY ||
                                chainId === ChainId.GÖRLI ||
                                chainId === ChainId.KOVAN ||
                                chainId === ChainId.ROPSTEN) &&
                              'Receive ETH'}
                            {chainId &&
                              (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) &&
                              'Receive BNB'}
                            {chainId &&
                              (chainId === ChainId.MATIC || chainId === ChainId.MUMBAI) &&
                              'Receive MATIC'}
                          </StyledInternalLink>
                        ) : null}
                      </RowBetween>
                    ) : null} */}
                      </AutoColumn>
                      {/* </LightCard> */}
                    </>
                  )}

                  {showDetailed && (
                    <>
                      <CurrencyInputPanel
                        value={formattedAmounts[Field.LIQUIDITY]}
                        onUserInput={onLiquidityInput}
                        onMax={() => {
                          onUserInput(Field.LIQUIDITY_PERCENT, '100')
                        }}
                        showMaxButton={!atMaxAmount}
                        disableCurrencySelect
                        currency={pair?.liquidityToken}
                        pair={pair}
                        id="liquidity-amount"
                      />
                      <ColumnCenter>
                        <ArrowDown size="16" color={theme.text2} />
                      </ColumnCenter>
                      <CurrencyInputPanel
                        hideBalance={true}
                        value={formattedAmounts[Field.CURRENCY_A]}
                        onUserInput={onCurrencyAInput}
                        onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                        showMaxButton={!atMaxAmount}
                        currency={currencyA}
                        label={'Output'}
                        onCurrencySelect={handleSelectCurrencyA}
                        id="remove-liquidity-tokena"
                      />
                      <ColumnCenter>
                        <Plus size="16" color={theme.text2} />
                      </ColumnCenter>
                      <CurrencyInputPanel
                        hideBalance={true}
                        value={formattedAmounts[Field.CURRENCY_B]}
                        onUserInput={onCurrencyBInput}
                        onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                        showMaxButton={!atMaxAmount}
                        currency={currencyB}
                        label={'Output'}
                        onCurrencySelect={handleSelectCurrencyB}
                        id="remove-liquidity-tokenb"
                      />
                    </>
                  )}
                  {pair && (
                    <div style={{ padding: '10px 0px', display: 'grid', gridRowGap: 16 }}>
                      <RowBetween fontWeight={500} fontSize={14} style={{justifyContent: 'space-between'}}>
                        Exchange Rate:
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '65%' }}>
                          1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
                          {currencyB?.symbol}
                        </div>
                      </RowBetween>
                      <RowBetween fontWeight={500} fontSize={14}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                          1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
                          {currencyA?.symbol}
                        </div>
                      </RowBetween>
                    </div>
                  )}
                  <div style={{ position: 'relative' }}>
                    {!account ? (
                      <ButtonLight onClick={toggleWalletModal}>Connect Your Wallet</ButtonLight>
                    ) : (
                      <RowBetween>
                        <ButtonConfirmed
                          onClick={onAttemptToApprove}
                          confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                          disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                          mr="0.5rem"
                          fontWeight={500}
                          fontSize={16}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <Dots>Approving</Dots>
                          ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                            'Approved'
                          ) : (
                            'Approve'
                          )}
                        </ButtonConfirmed>
                        <ButtonError
                          onClick={() => {
                            setShowConfirm(true)
                          }}
                          disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                          error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                        >
                          <Text fontSize={16} fontWeight={500}>
                            {error || 'Withdraw'}
                          </Text>
                        </ButtonError>
                      </RowBetween>
                    )}
                  </div>
                </AutoColumn>
              </Wrapper>
            </AppBody>
            {/* </div> */}
            {pair ? (
              <AutoColumn style={{ minWidth: '20rem', width: '100%', display: 'block' }}>
                <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
              </AutoColumn>
            ) : null}
          </ApBody>
        </AppWrapper>
        {/* <GraphDiv> */}
        {/* <UpperSection>
            <Account />
          </UpperSection> */}
        {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyItems: 'center',
              flexDirection: 'column',
              height: '100%',
              textAlign: 'center',
              position: "relative",
              
            }}
          > */}
        {/* {showFinder ? (
              <div>
                <PoolFinder />
              </div>
            ) : (
              <>
                <Imports
                  handlePool={handlePool}
                  v2={v2PairsWithoutStakedAmount}
                  loading={v2IsLoading}
                  account={account}
                  stakingPairs={stakingPairs}
                  hasV1Liquidity={hasV1Liquidity}
                  showFinder={showFinderHandler}
                />
              </>
            )} */}
        {/* </div> */}

        {/* </GraphDiv> */}
      </ContentWrapper>
    </>
  )
}

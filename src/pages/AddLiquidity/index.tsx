import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, BNB, MATIC, AVAX, TokenAmount, WETH, Pair, JSBI } from '@spherium/swap-sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import Settings from '../../components/Settings'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Link as Redirect } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFlat } from '../../components/Row'
import SingleArrow from '../../assets/images/singleArrow.svg'
import { ROUTER_ADDRESS } from '../../constants'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import { PoolPriceBar } from './PoolPriceBar'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import Account from 'components/Account'
import { BottomGrouping } from 'components/swap/styleds'
import PairNotFound from '../../assets/images/pairNotfound.png'
import Imports from 'pages/Pool/Imports'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import useWindowDimensions from 'hooks/useWindowDimensions'

const UpperSection = styled.div`
  align-items: center;
  width: 100%;
  justify-content: space-between;
  display: flex;
  height: 84px;
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
  display: flow-root;
  width: 100%;
  height: 100%;
  position: relative;
  max-width: 60%;
  background: radial-gradient(940px 909px at center, rgba(52, 56, 91, 0.1), transparent, transparent);

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-bottom: 170px;
  `};
`
const OverViewTxt = styled.p`
  font-weight: 700;
  font-size: 26px;
  width: 35%;

  @media (max-width: 845px) {
    display: none;
  }
`

const InputWrapper = styled(AutoColumn)`
  display: block;
  padding: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
padding: 10px;
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
    //padding: 1rem;
    display: grid;
  `};
`
const AppWrapper = styled.div`
  width: 100%;
  border-left: none;
  height: 100%;
  justify-content: end;
  display: inline-flex;
  flex-direction: column;
  flex-flow: column;
  align-items: center;
  overflow-x: hidden;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px;
    display: block;

  `};
`

const InputFieldWrapper = styled(AutoColumn)`
  display: block;
  background-color: #0E1218;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  height: 184px;
`
const DoubleArrowWrapper = styled.div`
  z-index: 1;
  height: 0px;
  :hover {
    cursor: pointer;
  }
`

export default function AddLiquidity({
  currencyIdA,
  currencyIdB,
  updateCurrencyA,
  updateCurrencyB,
  isCreate
}: {
  currencyIdB: Currency | any
  currencyIdA: Currency | any
  updateCurrencyA: (newCurreny: string) => void
  updateCurrencyB: (newCurreny: string) => void
  isCreate: boolean
}) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (
      currencyA === ETHER ||
      currencyB === ETHER ||
      currencyA === AVAX ||
      currencyB === AVAX ||
      currencyA === BNB ||
      currencyA === MATIC ||
      currencyB === BNB ||
      currencyB === MATIC
    ) {
      const tokenBIsETH = currencyB === ETHER || currencyB === BNB || currencyB === MATIC || currencyB === AVAX
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px" style={{ marginRight: '1.5rem', marginLeft: '1.5rem', display: 'block' }}>
        <LightCard mt="20px" borderRadius="8px">
          <RowFlat style={{ alignItems: 'center' }}>
            <Text fontSize="28px" fontWeight={500} lineHeight="42px" marginRight={10}>
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn
        gap="20px"
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1rem 32px',
          padding: 10,
          background: 'linear-gradient(107.84deg, #65B6D0 9.82%, #884DD3 139.48%)',
          opacity: 0.7,
          borderRadius: 8
        }}
      >
        <RowFlat style={{ flexDirection: 'row-reverse', marginLeft: 10 }}>
          {/* <Text fontSize="30px" fontWeight={500} lineHeight="42px" marginRight={10} margin={'0px 0px 0px 5px'}>
            {liquidityMinted?.toSignificant(6)}
          </Text> */}
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <Text fontSize="24px" margin={'0px 0px 0px 5px'}>
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </Row>
        {/* <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '} margin={'0px 0px 0px 5px'}>
          {`Output is estimated. If the price changes by more than ${allowedSlippage /
            100}% your transaction will revert.`}
        </TYPE.italic> */}
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        // history.push(`/add/${currencyIdB}/${currencyIdA}`)
        updateCurrencyA(newCurrencyIdA)
        updateCurrencyB(currencyIdB)
           } else {
        // history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
        updateCurrencyA(newCurrencyIdA)
        updateCurrencyB(currencyIdB)
           }
    },
    [currencyB, currencyA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          // history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
          updateCurrencyA(currencyIdB)
          updateCurrencyB(newCurrencyIdB)
             } else {
          // history.push(`/add/${newCurrencyIdB}`)
          updateCurrencyA(newCurrencyIdB)
        }
      } else {
        // history.push(`/add/${currencyIdA ? currencyIdA : 'BNB'}/${newCurrencyIdB}`)
        updateCurrencyA(currencyIdA ? currencyIdA : 'BNB')
        updateCurrencyB(newCurrencyIdB)
      }
      
    },
    [currencyB, currencyA]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

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
  // fetch the reserves for all V2 pools in which the user has a balance

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

  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()
  const [clicked, setClicked] = useState(false)

  const { width } = useWindowDimensions()

  return (
    <>
      <ContentWrapper>
        <AppWrapper>
          <ApBody>
            <div style={{ padding: '0rem' }}>
              <AppBody>
                <Wrapper>
                  <TransactionConfirmationModal
                    isOpen={showConfirm}
                    onDismiss={handleDismissConfirmation}
                    attemptingTxn={attemptingTxn}
                    hash={txHash}
                    content={() => (
                      <ConfirmationModalContent
                        title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
                        onDismiss={handleDismissConfirmation}
                        topContent={modalHeader}
                        bottomContent={modalBottom}
                      />
                    )}
                    pendingText={pendingText}
                    currencyToAdd={pair?.liquidityToken}
                  />
                  <AutoColumn style={{ display: 'block' }}>
                    {/* {noLiquidity || isCreate ? (
                      <ColumnCenter>
                        <BlueCard>
                          <AutoColumn gap="10px">
                            <TYPE.link fontWeight={600} color={'#2A324A'}>
                              You are the first liquidity provider.
                            </TYPE.link>
                            <TYPE.link fontWeight={400} color={'#2A324A'}>
                              The ratio of tokens you add will set the price of this pool. Once you are happy with the
                              rate click supply to review.
                            </TYPE.link>
                          </AutoColumn>
                        </BlueCard>
                      </ColumnCenter>
                    ) : (
                      <ColumnCenter>
                        <BlueCard>
                          <AutoColumn gap="10px">
                            <TYPE.link fontWeight={400} color={'#2A324A'}>
                              <b>Tip:</b> When you add liquidity, you will receive pool tokens representing your
                              position.
                            </TYPE.link>
                            <TYPE.link fontWeight={400} color={'#2A324A'}>
                              {' '}
                              These tokens automatically earn fees proportional to your share of the pool, and can be
                              redeemed at any time.
                            </TYPE.link>
                          </AutoColumn>
                        </BlueCard>
                      </ColumnCenter>
                    )} */}
                    <InputFieldWrapper>
                      <CurrencyInputPanel
                        value={formattedAmounts[Field.CURRENCY_A]}
                        onUserInput={onFieldAInput}
                        onMax={() => {
                          onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                        }}
                        onCurrencySelect={handleCurrencyASelect}
                        showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                        currency={!clicked ? currencies[Field.CURRENCY_A] : currencies[Field.CURRENCY_B]}
                        id="add-liquidity-input-tokena"
                        showCommonBases
                      />
                    </InputFieldWrapper>
                    <DoubleArrowWrapper>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={SingleArrow} style={{ position: 'relative', top: '-30px' }} />
                      </div>
                    </DoubleArrowWrapper>
                    <InputFieldWrapper>
                      <CurrencyInputPanel
                        value={formattedAmounts[Field.CURRENCY_B]}
                        onUserInput={onFieldBInput}
                        onCurrencySelect={handleCurrencyBSelect}
                        onMax={() => {
                          onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                        }}
                        showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                        currency={!clicked ? currencies[Field.CURRENCY_B] : currencies[Field.CURRENCY_A]}
                        id="add-liquidity-input-tokenb"
                        showCommonBases
                      />
                    </InputFieldWrapper>
                    {addIsUnsupported ? (
                      <ButtonPrimary
                        disabled={true}
                        style={{ textAlign: 'center', background: '#828DB0', marginTop: 11 }}
                      >
                        <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
                      </ButtonPrimary>
                    ) : !account ? (
                      <ButtonPrimary style={{ width: '100%', marginTop: 11 }} onClick={toggleWalletModal}>
                        Connect Your Wallet
                      </ButtonPrimary>
                    ) : (
                      <AutoColumn gap={'md'} style={{ display: 'block' }}>
                        {(approvalA === ApprovalState.NOT_APPROVED ||
                          approvalA === ApprovalState.PENDING ||
                          approvalB === ApprovalState.NOT_APPROVED ||
                          approvalB === ApprovalState.PENDING) &&
                          isValid && (
                            <RowBetween style={{ gap: 15, marginBottom: 10 }}>
                              {approvalA !== ApprovalState.APPROVED && (
                                <ButtonPrimary
                                  onClick={approveACallback}
                                  disabled={approvalA === ApprovalState.PENDING}
                                  width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                                  style={{ marginTop: 11 }}
                                >
                                  {approvalA === ApprovalState.PENDING ? (
                                    <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                                  ) : (
                                    'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                                  )}
                                </ButtonPrimary>
                              )}
                              {approvalB !== ApprovalState.APPROVED && (
                                <ButtonPrimary
                                  onClick={approveBCallback}
                                  disabled={approvalB === ApprovalState.PENDING}
                                  width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                                  style={{ marginTop: 11 }}
                                >
                                  {approvalB === ApprovalState.PENDING ? (
                                    <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                                  ) : (
                                    'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                                  )}
                                </ButtonPrimary>
                              )}
                            </RowBetween>
                          )}
                        <ButtonError
                          style={{ width: '100%', marginTop: 11 }}
                          onClick={() => {
                            expertMode ? onAdd() : setShowConfirm(true)
                          }}
                          disabled={
                            !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                          }
                          error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                        >
                          <Text fontSize={20} fontWeight={500}>
                            {error ?? 'Supply'}
                          </Text>
                        </ButtonError>
                      </AutoColumn>
                    )}
                  </AutoColumn>
                </Wrapper>
                {!addIsUnsupported ? (
                  pair &&
                  !noLiquidity &&
                  pairState !== PairState.INVALID && (
                    <AutoColumn
                      style={{
                        minWidth: '30%',
                        width: '100%',
                        maxWidth: '30%',
                        marginTop: '1rem',
                        display: 'inline'
                      }}
                    >
                      <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                    </AutoColumn>
                  )
                ) : (
                  <UnsupportedCurrencyFooter
                    show={addIsUnsupported}
                    currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
                  />
                )}
              </AppBody>
            </div>
          </ApBody>
        </AppWrapper>
      </ContentWrapper>
    </>
  )
}

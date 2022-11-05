import React, { useContext, useLayoutEffect, useMemo, useState } from 'react'
import styled, { keyframes, ThemeContext } from 'styled-components'
import { Pair, JSBI } from '@spherium/swap-sdk'
import { Link, RouteComponentProps } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import Settings from '../../components/Settings'

import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'

import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard } from '../../components/earn/styled'
import { REWARDS_DURATION_DAYS, useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import Liquidity from '../../assets/images/2_white.svg'
import PairImg from '../../assets/images/1_white.svg'
import { isBSC } from 'utils/checkBSC'
import CreatePool from '../../pages/AddLiquidity'
import PairNotFound from '../../assets/images/pairNotfound.png'
import Account from '../../components/Account'
import { Link as Redirect } from 'react-router-dom'
import { LiquidityTabs } from '../../components/NavigationTabs'
import Imports from 'pages/Pool/Imports'
import Navbar from './Navbar'
import AddLiquidity from '../../pages/AddLiquidity'
import PoolFinder from 'pages/PoolFinder'
import qs from 'qs'
import { useEffect } from 'react'
import MobileHeader from 'components/MobileHeader'
import useWindowDimensions from 'hooks/useWindowDimensions'
import CopyRight from 'components/Copyright'
import HeroImage from '../../assets/svg/heroImage.svg'
import { useMintState } from 'state/mint/hooks'

const ToggleWrapper = styled(RowBetween)`
  gap: 15px;
  margin-bottom: 20px;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  //color: #2a324a;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-top: 17px;
  margin-bottom: 12px;
  background-color: transparent;
  gap: 8px;


`};
`

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 50%;
  margin: ${({ active }) => (active ? '4px' : '0px')};
  list-style: none;
  padding: 17px 0px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  margin-right: 4px;
  cursor: pointer;
  background: ${({ active }) =>
    active ? 'linear-gradient(107.84deg, #65B6D0 9.82%, #884DD3 139.48%)' : 'rgba(255, 255, 255, 0.18)'};
  color: #fff;
  user-select: none;
  border: ${({ active }) => (active ? 'none' : '1px solid rgba(255, 255, 255, 0.17)')};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall<{ active?: boolean }>`
  background: ${({ active }) => (active ? '#2e37f2' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#828DB0')};
  border: 1px solid #A7B1D2;
  color: ${({ active }) => (active ? '#fff' : '#2A324A')};

    `};
`

const UpperSection = styled.div`
  align-items: center;
  height: 84px;
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
  overflow: auto;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  display: grid;
  overflow: visible;
`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: flex;
  flex-direction: column;
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
  //background-color: white;
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
  display: inline-table;

`};
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
`

const LabelWrapper = styled.div`
  border-radius: 12px;
  display: grid;
  min-height: 283px;
  background-position: bottom;
  background-repeat: no-repeat;
  background-image: url(${HeroImage});
  @media (max-width: 500px) {
    //padding: 24px;
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

export default function LiquidityPool({ location }: RouteComponentProps<{ location: any }>) {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
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

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const [currentWindow, setCurrentWindow] = useState('')
  const [currencyIdA, setCurrencyIdA] = useState<string>('')
  const [currencyIdB, setCurrencyIdB] = useState<string>('')
  const [showFinder, setShowFinder] = useState(false)
  const [currencyA, setCurrencyA] = useState<any>('')
  const [currencyB, setCurrencyB] = useState<string | any>('')
  const [isPooled, setIsPooled] = useState<boolean | undefined>(false)
  const [clicked, setClicked] = useState(false)
  const handlePool = () => {
    setIsPooled(true)
  }

  const withoutqotes = (currencyTest: string) => {
    if (currencyTest === null) return ''
    else if (currencyTest.includes('"') && currencyTest !== null) return currencyTest.replace(/['"]+/g, '')
    else return currencyTest.replace(/['"]+/g, '')
  }
  const updateCurrencyA = (newCurrency: string) => {
    setIsPooled(false)
    setCurrencyIdA(isPooled ? withoutqotes(currencyA) : newCurrency)
  }

  const updateCurrencyB = (newCurrency: string) => {
    setIsPooled(false)
    setCurrencyIdB(isPooled ? withoutqotes(currencyB) : newCurrency)
  }

  const hideFinderHandler = () => {
    setShowFinder(false)
  }
  const showFinderHandler = () => {
    setShowFinder(true)
  }

  const { currency_A, currency_B } = useMintState()

  useEffect(() => {
    setCurrencyA(currency_A)
    setCurrencyB(currency_B)
    if (isPooled) {
      addPooled()
    }
  })

  const addPooled = () => {
    setCurrentWindow('add')
    setClicked(false)
  }

  const clearState = () => {
    setClicked(true)
    setCurrentWindow('create')
    setIsPooled(false)
    setCurrencyIdA('')
    setCurrencyIdB('')
  }

  const { width } = useWindowDimensions()

  return (
    <>
      <BodyContent>
        <ContentWrapper>
          <AppWrapper>
            <ApBody>
              {/* <MobileHeader /> */}
              <RowBetween
                style={{
                  gap: width < 500 ? 0 : 12,
                  position: 'relative',
                  top: width < 500 ? '-8px' : '26.5px',
                  paddingBottom: 20,
                  paddingLeft: width < 500 ? 20 : 32,
                  paddingRight: width < 500 ? 20 : 24,
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: width < 500 ? 14 : 0,
                  borderRadius: width < 500 ? 20 : 0
                }}
              >
                <div style={{ display: width < 500 ? 'grid' : 'flex' }}>
                  <span style={{ fontSize: 24, fontWeight: 500 }}>Liquidity</span>
                  <span
                    style={{
                      justifyContent: 'end',
                      position: 'relative',
                      top: width < 500 ? '-2px' : '6px',
                      left: width < 500 ? 0 : 12,
                      width: '100%',
                      fontWeight: 500,
                      color: '#fff',
                      opacity: 0.6,
                      fontSize: 12
                    }}
                  >
                    Add liquidity to receive LP tokens
                  </span>
                </div>
                <RowBetween style={{ justifyContent: 'flex-end', width: 50 }}>
                  <Settings />
                </RowBetween>
              </RowBetween>

              <div
                style={{
                  margin: width < 500 ? '0px 24px ' : 32,
                  borderTop: width < 500 ? ' 1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  display: 'flex',
                  flexDirection: 'column-reverse'
                }}
              >
                <ToggleWrapper>
                  <ToggleOption
                    onClick={() => {
                      clearState()
                    }}
                    active={currentWindow === 'create'}
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      borderRadius: 8,
                      height: width < 500 ? '48px' : '',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    Create Pool
                  </ToggleOption>
                  <ToggleOption
                    onClick={() => {
                      addPooled()
                    }}
                    active={currentWindow === 'add' || isPooled}
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      borderRadius: 8,
                      height: width < 500 ? '48px' : '',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    Add Liquidity
                  </ToggleOption>
                </ToggleWrapper>
                {currentWindow === '' ? (
                  <LabelWrapper className="liquidity-proivder-reward">
                    <div
                      style={{
                        backgroundImage:
                          'linear-gradient(300.52deg, rgba(255, 255, 255, 0.04) -3.9%, rgba(157, 157, 158, 0.17) 69.98%)',
                        padding: 32,
                        borderRadius: 12
                      }}
                    >
                      <h1 style={{ fontSize: 14, fontWeight: 400, margin: 0 }}> Liquidity provider rewards</h1>
                      <p style={{ fontSize: 12, fontWeight: 500, opacity: 0.6, lineHeight: '16px' }}>
                        {`Liquidity providers earn a 0.27% fee on all trades proportional to their share of the pool and 0.03% fee for those Liquidity providers that stake the SPHRI token to our Staking Pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
                      </p>
                    </div>
                  </LabelWrapper>
                ) : currentWindow === 'create' ? (
                  <div className="create">
                    <AddLiquidity
                      isCreate
                      currencyIdA={currencyIdA}
                      currencyIdB={currencyIdB}
                      updateCurrencyA={updateCurrencyA}
                      updateCurrencyB={updateCurrencyB}
                    />
                  </div>
                ) : !isPooled ? (
                  // <div className="add-liquidity">
                  <AddLiquidity
                    isCreate={false}
                    currencyIdA={currencyIdA}
                    currencyIdB={currencyIdB}
                    updateCurrencyA={updateCurrencyA}
                    updateCurrencyB={updateCurrencyB}
                  />
                ) : (
                  // </div>
                  <AddLiquidity
                    isCreate={false}
                    currencyIdA={withoutqotes(currencyA)}
                    currencyIdB={withoutqotes(currencyB)}
                    updateCurrencyA={updateCurrencyA}
                    updateCurrencyB={updateCurrencyB}
                  />
                )}
              </div>
            </ApBody>
          </AppWrapper>
          <GraphDiv>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                flexDirection: 'column',
                height: '100%',
                textAlign: 'center',
                marginBottom: 150
              }}
            >
              {showFinder ? (
                <div>
                  <PoolFinder onButtonClick={() => {}} />
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
              )}
            </div>
          </GraphDiv>
        </ContentWrapper>
        <CopyRight />
      </BodyContent>
    </>
  )
}

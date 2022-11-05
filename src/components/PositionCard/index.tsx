import { JSBI, Pair, Percent, TokenAmount, ChainId, Currency } from '@spherium/swap-sdk'
import { darken } from 'polished'
import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonPrimary, ButtonEmpty, ButtonSecondary } from '../Button'

import Card, { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { BIG_INT_ZERO } from '../../constants'
import RemoveLiquidity from 'pages/RemoveLiquidity'
import Modal from 'components/Modal'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { useDispatch } from 'react-redux'
import { setCurrencyA, setCurrencyB } from '../../state/mint/actions'
export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
  z-index: 1000;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  justify-content: stretch;
  align-items: center;
  padding: 1rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #15171c;
  margin-bottom: 5px;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
  margin-right: 0px;
  margin-left: 0px;


  &:last-child {
    margin-bottom: 26px;
  }

`};
`

interface PositionCardProps {
  handlePool?(): void
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0, chainId)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1, chainId)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={'none'} style={{ display: 'block', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <AutoColumn gap="12px" style={{ justifyContent: 'inherit', display: 'block' }}>
            {/* <FixedHeightRow>
              <RowFixed style={{display: "grid"}} >
                <Text fontWeight={600} fontSize={14} color={'#2A324A'}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <RowFixed style={{display: "flex", textAlign: "center", justifyContent: 'flex-end'}}>
                <Text fontWeight={600} fontSize={14} color={'#2A324A'}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
                <Text fontWeight={600} fontSize={14} color={'#2A324A'} margin={'0px 0px 0px 7px'}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
                </RowFixed>
              </RowFixed>
            </FixedHeightRow> */}
            <AutoColumn gap="4px" style={{ display: 'block' }}>
              <FixedHeightRow>
                <Text fontWeight={500} fontSize={14} style={{ width: '100%', display: 'flex' }}>
                  Your pool share:
                </Text>
                <Text
                  fontWeight={500}
                  fontSize={14}
                  style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
                >
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontWeight={500} fontSize={14} style={{ width: '100%' }}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text
                      fontWeight={500}
                      fontSize={14}
                      style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
                    >
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontWeight={500} fontSize={14} style={{ width: '100%' }}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text
                      fontWeight={500}
                      fontSize={14}
                      style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
                    >
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard style={{ marginTop: 10 }}>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            By adding liquidity you&apos;ll earn 0.27% of all trades on this pair proportional to your share of the
            pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

const CardHeader = styled.div`
  display: flex;
  padding: 2rem 1rem;
  align-items: center;
  justify-content: space-between;
  // background: linear-gradient(114.61deg, #dbddff 32.4%, rgba(164, 255, 233, 0) 150.98%);
  // opacity: 0.7;
  height: 80px;
  //padding: 1rem;

  #header-token-names {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`

const CardBody = styled.div`
  margin: 2rem;
  //background: linear-gradient(114.61deg, #dbddff 32.4%, rgba(164, 255, 233, 0) 150.98%);
  //border-radius: 8px;
  border-top: 1.5px solid rgba(255, 255, 255, 0.1);
  margin-top: 0px;
`

const CreateButton = styled(ButtonPrimary)`
  padding: 15px;
  font-size: 18px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  text-decoration: none;
  background-color: transparent;

  :hover {
    border: 2px solid #2e37f2;
    background-color: transparent;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 15px;


`};
`
const CloseIcon = styled.div`
  flex-direction: column;
  position: relative;
  height: fit-content;
  right: -3rem;
  justify-content: center;
  display: flex;
  border: 1px solid white;
  border-radius: 14px;
  top: -27px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media (max-width: 365px) {
    right: -1rem;
  }
`
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 4rem 1rem 0rem;
  font-weight: 500;
  justify-content: center;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;
`

const CloseColor = styled(X)`
  color: white;
  height: 18px;
  width: 18px;
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`

export default function FullPositionCard({ pair, border, stakedBalance, handlePool }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()
  const [modalView, setModalView] = useState(false)

  const currency0 = unwrappedToken(pair.token0, chainId)
  const currency1 = unwrappedToken(pair.token1, chainId)
  const dispatch = useDispatch()

  function ScrollHandler() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  const handleManage = (currencyA: Currency | any, currencyB: Currency | any) => {
    ScrollHandler()
    let currency: string[] = []
    currencyA = currencyId(currency0)
    currencyB = currencyId(currency1)
    dispatch(
      setCurrencyA({
        value: currencyA
      })
    )
    dispatch(
      setCurrencyB({
        value: currencyB
      })
    )
    handlePool && handlePool()

    return currency
  }

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const backgroundColor = '#15171C'

  const [currentWindow, setCurrentWindow] = useState('')
  const [currencyIdA, setCurrencyIdA] = useState<Currency | any>()
  const [currencyIdB, setCurrencyIdB] = useState<Currency | any>()

  const updateCurrencyA = (newCurrency: Currency | any) => {
    setCurrencyIdA(newCurrency)
  }
  const updateCurrencyB = (newCurrency: Currency | any) => {
    setCurrencyIdB(newCurrency)
  }
  const { width } = useWindowDimensions()

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor} style={{ padding: 0 }}>
      <CardHeader>
        <div id="header-token-names">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <div style={{ display: 'block' }}>
            <Text style={{ fontSize: 12, fontWeight: 400, opacity: 0.6, textAlign: 'left', marginLeft: 10 }}>
              Your Position
            </Text>
            <Text fontWeight={500} fontSize={width < 500 ? 13 : 18} marginLeft={10}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </div>
        </div>
        <div>
          <ButtonEmpty padding="6px 8px" width="fit-content" onClick={() => setShowMore(!showMore)}>
            {showMore ? (
              <>
                {width > 500 && 'Manage'}

                <ChevronUp size="20" style={{ marginLeft: '10px' }} />
              </>
            ) : (
              <>
                {width > 500 && 'Manage'}
                <ChevronDown size="20" style={{ marginLeft: '10px' }} />
              </>
            )}
          </ButtonEmpty>
        </div>
      </CardHeader>

      {showMore && (
        <CardBody>
          <FixedHeightRow style={{ justifyContent: 'space-between', marginBottom: 10, marginTop: 24 }}>
            <Text fontSize={14} fontWeight={400} opacity={0.6} width={'35%'} style={{ display: 'flex' }}>
              Your total pool tokens:
            </Text>
            <Text fontSize={14} fontWeight={400} opacity={0.6}>
              {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
            </Text>
          </FixedHeightRow>
          {stakedBalance && (
            <FixedHeightRow style={{ marginBottom: 10 }}>
              <Text fontSize={14} fontWeight={400} opacity={0.6}>
                Pool tokens in rewards pool:
              </Text>
              <Text fontSize={14} fontWeight={400} opacity={0.6} style={{ justifyContent: 'flex-end' }}>
                {stakedBalance.toSignificant(4)}
              </Text>
            </FixedHeightRow>
          )}
          <FixedHeightRow style={{ marginBottom: 10 }}>
            <RowFixed>
              <Text fontSize={14} fontWeight={400} opacity={0.6}>
                Pooled {currency0.symbol}:
              </Text>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed style={{ justifyContent: 'flex-end' }}>
                <Text fontSize={14} fontWeight={400} opacity={0.6}>
                  {token0Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow style={{ marginBottom: 10 }}>
            <RowFixed>
              <Text fontSize={14} fontWeight={400} opacity={0.6}>
                Pooled {currency1.symbol}:
              </Text>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed style={{ justifyContent: 'flex-end' }}>
                <Text fontSize={14} fontWeight={400} opacity={0.6}>
                  {token1Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <Text fontSize={14} fontWeight={400} opacity={0.6} width={'50%'} style={{ display: 'flex' }}>
              Your pool share:
            </Text>
            <Text fontSize={14} fontWeight={400} opacity={0.6}>
              {poolTokenPercentage
                ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                : '-'}
            </Text>
          </FixedHeightRow>

          {/* <ButtonSecondary padding="8px" borderRadius="8px">
            <ExternalLink style={{ width: '100%', textAlign: 'center' }} href={`#`}>
              View accrued fees and analytics<span style={{ fontSize: '11px' }}>↗</span>
            </ExternalLink>
          </ButtonSecondary> */}
          {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
            <RowBetween marginTop="20px" style={{ justifyContent: 'space-evenly', gap: 20 }}>
              <CreateButton
                padding="8px"
                borderRadius="8px"
                onClick={currency0 => {
                  handleManage(currency0, currency0)
                }}
                width="48%"
              >
                Add More Liquidity
              </CreateButton>

              {/* {currentWindow === 'add' && (
                <div className="add-liquidity">
                  <AddLiquidity
                    isCreate={false}
                    currencyIdA={currencyId(currency0)}
                    currencyIdB={currencyId(currency1)}
                    updateCurrencyA={updateCurrencyA}
                    updateCurrencyB={updateCurrencyB}
                  />
                </div>
              )} */}
              <CreateButton padding="8px" borderRadius="8px" width="48%" onClick={() => setModalView(!modalView)}>
                Withdraw Liquidity
              </CreateButton>
            </RowBetween>
          )}
          {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              as={Link}
              to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
              width="100%"
            >
              Manage Liquidity in Rewards Pool
            </ButtonPrimary>
          )}
        </CardBody>
      )}
      {modalView === true ? (
        <>
          <Modal isOpen={modalView} onDismiss={() => setModalView(false)}>
            <div style={{ display: 'block', width: '100%', height: 'fit-content' }}>
              <HeaderRow>
                <Text fontWeight={500} fontSize={24}>
                  Withdraw Liquidity
                </Text>
                <CloseIcon onClick={() => setModalView(false)}>
                  <CloseColor />
                </CloseIcon>
              </HeaderRow>

              <RemoveLiquidity
                currencyIdA={currencyId(currency0)}
                currencyIdB={currencyId(currency1)}
                updateCurrencyA={() => updateCurrencyA(currency0)}
                updateCurrencyB={() => updateCurrencyB(currency1)}
              />
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </StyledPositionCard>
  )
}

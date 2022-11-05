import { Currency, BNB, MATIC, ETHER, AVAX, JSBI, TokenAmount } from '@spherium/swap-sdk'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import { Plus, X } from 'react-feather'
import { Text } from 'rebass'
import { ButtonDropdownLight, ButtonPrimary } from '../../components/Button'
import styled, { ThemeContext } from 'styled-components'
import SpheriumLiq from '../../assets/images/spheriumLiq.png'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween } from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'
import { BlueCard } from '../../components/Card'
import { TYPE } from '../../theme'
import DoubleArrow from '../../assets/images/double-arrow.svg'
import { useMedia } from 'react-use'
import { Link } from 'react-router-dom'
import useWindowDimensions from 'hooks/useWindowDimensions'

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
const ApBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  //padding-top: 33px;

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
  //padding: 0px 50px 0px 50px;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
`};

  // ${({ theme }) => theme.mediaWidth.upToSmall`
  //   padding: 0px;
  //   display: block;

  // `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    overflow-x: visible;

`};
`
const GraphDiv = styled.div`
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
  `};
`

const Navbar = styled.div`
  display: block;
  //grid-template-columns: 9fr 7fr;
  align-items: center;
  //height: 90px;
  //padding: 0 0.3rem;

  @media screen and (max-width: 680px) {
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    height: 150px;
  }
`
const PageTitle = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;

  padding: 0px 5px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: none;
  height: 84px;

  & > * {
    font-family: 'Plus Jakarta Sans';
  }
  & #liq-title {
    font-weight: 700;
    color: #151928;
    font-size: 32px;
    line-height: 32px;
    margin-right: 10px;
    margin-left: 40px;
  }
  & #liq-subtitle {
    font-weight: 500;
    size: 16px;
    line-height: 14px;
    color: #2a324a;
    margin-top: 4px;
  }

  @media screen and (max-width: 1000px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    #liq-title {
      margin-top: 5px;
    }
    #liq-subtitle {
      margin-top: -12px;
    }
  }
`


const DoubleArrowWrapper = styled.div`
  z-index: 1;
  display: flex;
  height: 1px;
  justify-content: flex-end;
  :hover {
    cursor: pointer;
  }
`

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder({ onButtonClick }: { onButtonClick: () => void }) {
  const theme = useContext(ThemeContext)

  const { account, chainId } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(
    chainId === 97 || chainId === 56
      ? BNB
      : chainId === 137 || chainId === 80001
      ? MATIC
      : chainId === 43113 || chainId === 43114
      ? AVAX
      : ETHER
  )
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  const addNewPair = () => {
    if (pair) {
      addPair(pair)
      onButtonClick()
    }
  }
  // useEffect(() => {
  //   if (pair) {
  //     addPair(pair)
  //   }
  // }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const below500 = useMedia('(max-width: 500px)')

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const { width } = useWindowDimensions()

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
      </Text>
    </LightCard>
  )

  return (
    <ContentWrapper>
      <AppWrapper>
        <ApBody>
          <AppBody>
            <AutoColumn style={{ padding: '1rem' }} gap="md">
              <BlueCard style={{ backgroundColor: 'transparent', background: 'none' }}>
                <AutoColumn gap="10px">
                  <TYPE.link fontWeight={500} color={'#828DB0'} fontSize={14} textAlign={'center'}>
                    <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the interface.
                  </TYPE.link>
                </AutoColumn>
              </BlueCard>
              <div
                style={{
                  background:
                    'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)',
                  borderRadius: 8
                }}
              >
                <ButtonDropdownLight
                  onClick={() => {
                    setShowSearch(true)
                    setActiveField(Fields.TOKEN0)
                  }}
                >
                  {currency0 ? (
                    <Row>
                      <CurrencyLogo currency={currency0} />
                      <div style={{ display: 'grid', textAlign: 'left' }}>
                        <span style={{fontSize: 14, fontWeight: 500, marginLeft: 13, color: '#fff' }}>
                          Your asset
                        </span>
                        <Text fontWeight={500} fontSize={16} marginLeft={'12px'} color={'#fff'}>
                          {currency0.symbol}
                        </Text>
                      </div>
                    </Row>
                  ) : (
                    <>
                      <Text
                        fontWeight={500}
                        fontSize={16}
                        marginLeft={'12px'}
                        marginRight={'12px'}
                        marginBottom={'-17px'}
                        color={'#fff'}
                      >
                        Select a Token
                      </Text>
                    </>
                  )}
                </ButtonDropdownLight>

                <ColumnCenter style={{backgroundColor: 'rgba(255, 255, 255, 0.08)'}}>
                <DoubleArrowWrapper>
        <div>
          <img src={DoubleArrow} style={{ position: 'relative', top: '-27px' }} />
        </div>
      </DoubleArrowWrapper>
                </ColumnCenter>

                <ButtonDropdownLight
                  onClick={() => {
                    setShowSearch(true)
                    setActiveField(Fields.TOKEN1)
                  }}
                >
                  {currency1 ? (
                    <Row>
                      <CurrencyLogo currency={currency1} />
                      <Text fontWeight={500} fontSize={16} marginLeft={'12px'} color={'#fff'}>
                        {currency1.symbol}
                      </Text>
                    </Row>
                  ) : (
                    <Text fontWeight={500} fontSize={16} marginLeft={'12px'} marginRight={'12px'} color={'#fff'}>
                      Select a Token
                    </Text>
                  )}
                </ButtonDropdownLight>
              </div>
              {hasPosition && (
                <ColumnCenter
                  style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
                >
                  <Text textAlign="center" fontWeight={500} fontSize={18}>
                    Pool Found!
                  </Text>
                  <ButtonPrimary
                    onClick={() => {
                      pair ? addNewPair() : onButtonClick()
                    }}
                  >
                    <Text textAlign="center" color={theme.white}>
                      Manage this pool.
                    </Text>
                  </ButtonPrimary>
                </ColumnCenter>
              )}

              {currency0 && currency1 ? (
                pairState === PairState.EXISTS ? (
                  hasPosition && pair ? (
                    <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                  ) : (
                    // <LightCard padding="45px 10px">
                      <AutoColumn gap="sm" justify="center">
                        <Text textAlign="center">You don’t have liquidity in this pool yet.</Text>
                        <StyledInternalLink to={`/pool`} onClick={onButtonClick}>
                          <Text textAlign="center" color={theme.text8}>
                            Add liquidity.
                          </Text>
                        </StyledInternalLink>
                      </AutoColumn>
                    // </LightCard>
                  )
                ) : validPairNoLiquidity ? (
                  // <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center">No pool found.</Text>
                      <StyledInternalLink to={`/pool`} onClick={onButtonClick}>
                        <Text color={theme.text8}> Create pool.</Text>
                      </StyledInternalLink>
                    </AutoColumn>
                  // </LightCard>
                ) : pairState === PairState.INVALID ? (
                  // <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center" fontWeight={500}>
                        Invalid pair.
                      </Text>
                    </AutoColumn>
                  // </LightCard>
                ) : pairState === PairState.LOADING ? (
                  // <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center">
                        Loading
                        <Dots />
                      </Text>
                    </AutoColumn>
                  // </LightCard>
                ) : null
              ) : (
                prerequisiteMessage
              )}
            </AutoColumn>
            <CurrencySearchModal
              isOpen={showSearch}
              onCurrencySelect={handleCurrencySelect}
              onDismiss={handleSearchDismiss}
              showCommonBases
              selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
            />
          </AppBody>
        </ApBody>
      </AppWrapper>
    </ContentWrapper>
  )
}

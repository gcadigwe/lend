import { Trade, TradeType, ChainId, BNB, AVAX } from '@spherium/swap-sdk'
import useWindowDimensions from 'hooks/useWindowDimensions'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE, ExternalLink } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

// const InfoLink = styled(ExternalLink)`
//   width: 100%;
//   border: 1px solid ${({ theme }) => theme.bg3};
//   padding: 6px 6px;
//   border-radius: 8px;
//   text-align: center;
//   font-size: 14px;
//   color: ${({ theme }) => theme.text1};
// `

function TradeSummary({
  trade,
  allowedSlippage,
  chainId
}: {
  trade: Trade
  allowedSlippage: number
  chainId: ChainId | undefined
}) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade, chainId)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { width } = useWindowDimensions()

  return (
    <>
      <AutoColumn style={{ display: 'block' }}>
        <RowBetween width={'100%'}>
          <RowFixed width={'100%'}>
            <TYPE.black fontSize={ width < 500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed style={{ justifyContent: 'flex-end', color: 'black' }}>
            <TYPE.black fontSize={ width < 500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${
                    (chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC_MAINNET) &&
                    trade.outputAmount.currency.symbol === 'ETH'
                      ? BNB.symbol
                      : trade.outputAmount.currency.symbol
                  }` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
                    (chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC_MAINNET) &&
                    trade.inputAmount.currency.symbol === 'ETH'
                      ? BNB.symbol
                      : trade.inputAmount.currency.symbol
                  }` ?? '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={ width < 500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween width={'100%'}>
          <RowFixed width={'100%'} style={{display: 'flex', alignItems: 'center'}}>
            <TYPE.black fontSize={ width < 500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <RowFixed style={{ justifyContent: 'flex-end' }}>
            <TYPE.black fontSize={ width < 500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              {realizedLPFee
                ? `${realizedLPFee.toSignificant(4)} ${
                    (chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC_MAINNET) &&
                    trade.inputAmount.currency.symbol === 'ETH'
                      ? BNB.symbol
                      : trade.inputAmount.currency.symbol
                  }`
                : '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
  chainId?: ChainId
}

export function AdvancedSwapDetails({ trade, chainId }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)
  const { width } = useWindowDimensions()

  return (
    <AutoColumn
      gap="0px"
      style={{
        display: 'block',
        padding: '34px 23px 23px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 8
      }}
    >
      {trade && (
        <>
          <TradeSummary trade={trade} chainId={chainId} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <TYPE.black fontSize={ width < 500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
          {/* {!showRoute && (
            <AutoColumn style={{ padding: '12px 16px 0 16px', display: "flex" }}>
              <InfoLink
                href={'#' + trade.route.pairs[0].liquidityToken.address}
                target="_blank"
              >
                View pair analytics ↗
              </InfoLink>
            </AutoColumn>
          )} */}
        </>
      )}
    </AutoColumn>
  )
}

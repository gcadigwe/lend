import { Trade, TradeType, ChainId, BNB } from '@spherium/swap-sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { isBSC } from 'utils/checkBSC'
import { useMedia } from 'react-use'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  chainId
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  chainId: ChainId | undefined
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])

  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade, chainId), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)
  const below500 = useMedia('(max-width: 500px)')

  return (
    <>
      <AutoColumn
        gap="0px"
        style={{
          display: 'block',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: '20px 20px 4px 20px',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <RowBetween align="center">
          <Text fontSize={below500 ? 12 : 14} fontWeight={400} color={'#fff'} opacity={0.6}>
            Price
          </Text>
          <Text
            width={'100%'}
            opacity={0.6}
            fontWeight={400}
            fontSize={below500 ? 12 : 14}
            color={'#fff'}
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            {formatExecutionPrice(chainId, trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} color={'white'} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween width={'100%'}>
          <RowFixed width={'100%'}>
            <TYPE.black fontSize={below500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed style={{ justifyContent: 'flex-end', color: 'black' }}>
            <TYPE.black fontSize={below500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TYPE.black>
            <TYPE.black fontSize={below500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'} marginLeft={'4px'}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? isBSC(chainId) && trade.outputAmount.currency.symbol === 'ETH'
                  ? BNB.symbol
                  : trade.outputAmount.currency.symbol
                : isBSC(chainId) && trade.inputAmount.currency.symbol === 'ETH'
                ? BNB.symbol
                : trade.inputAmount.currency.symbol}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={below500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween width={'100%'}>
          <RowFixed width={'100%'}>
            <TYPE.black fontSize={below500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              Liquidity Provider Fee
              <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
            </TYPE.black>
          </RowFixed>
          <RowFixed style={{ justifyContent: 'flex-end' }}>
            <TYPE.black fontSize={below500 ? 12 : 14} fontWeight={400} opacity={0.6} color={'#fff'}>
              {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.symbol : '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <AutoRow>
          <ButtonError
            onClick={onConfirm}
            disabled={disabledConfirm}
            error={severity > 2}
            style={{ marginTop: 20 }}
            id="confirm-swap-or-send"
          >
            <Text fontSize={18} fontWeight={400}>
              {severity > 2 ? 'Swap Anyway' : 'Proceed to Swap'}
            </Text>
          </ButtonError>

          {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        </AutoRow>
      </AutoColumn>
    </>
  )
}

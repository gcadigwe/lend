import { Trade, TradeType, BNB } from '@spherium/swap-sdk'
import React, { useContext, useMemo } from 'react'
import { ArrowDown, AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import Row, { RowBetween, RowFixed } from '../Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { isBSC } from 'utils/checkBSC'
import { useActiveWeb3React } from 'hooks'
import DoubleArrow from '../../assets/images/double-arrow.svg'
import { useMedia } from 'react-use'

const DoubleArrowWrapper = styled.div`
  z-index: 1;
  display: flex;
  height: 1px;
  justify-content: flex-end;
  :hover {
    cursor: pointer;
  }
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const { chainId } = useActiveWeb3React()
  const below500 = useMedia('(max-width: 500px)')
  const theme = useContext(ThemeContext)
  
  return (
    <AutoColumn
      gap={'md'}
      style={{
        margin: below500 ? '24px 24px 0px' : '24px 32px 0px',
        display: 'block',
        justifyContent: 'flex-start',
        borderRadius: 8,
        background: 'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)',
        height: 'auto'
      }}
    >
      <RowBetween
        align="flex-end"
        style={{ borderBottom: '1.5px solid rgba(255, 255, 255, 0.08)', height: 80, alignItems: 'center' }}
      >
        <CurrencyLogo
          style={{  marginLeft: '25.67px' }}
          currency={isBSC(chainId) && trade.inputAmount.currency.symbol === 'ETH' ? BNB : trade.inputAmount.currency}
          size={'24px'}
        />
        <RowBetween style={{ display: 'block', paddingLeft: '11.67px' }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 400, opacity: 0.6 }}>Swap From</Text>
          <RowFixed gap={'0px'}>
            <TruncatedText
              fontSize={16}
              fontWeight={600}
              color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? '#fff' : '#fff'}
            >
              {trade.inputAmount.toSignificant(6)}
              {isBSC(chainId) && trade.inputAmount.currency.symbol === 'ETH'
                ? BNB.symbol
                : trade.inputAmount.currency.symbol}
            </TruncatedText>
          </RowFixed>
        </RowBetween>
      </RowBetween>
      <DoubleArrowWrapper>
        <div>
          <img src={DoubleArrow} style={{ position: 'relative', top: '-27px' }} />
        </div>
      </DoubleArrowWrapper>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'} style={{ height: 80, alignItems: 'center' }}>
          <CurrencyLogo
            currency={
              isBSC(chainId) && trade.outputAmount.currency.symbol === 'ETH' ? BNB : trade.outputAmount.currency
            }
            size={'24px'}
            style={{  marginLeft: '25.67px' }}
          />
          <RowBetween style={{ display: 'block', paddingLeft: '11.67px' }}>
            <Text style={{ color: '#828DB0', fontSize: 14, fontWeight: 500 }}>Swap To</Text>
            <TruncatedText
              fontSize={16}
              fontWeight={600}
              color={
                priceImpactSeverity > 2
                  ? theme.red1
                  : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                  ? '#fff'
                  : '#fff'
              }
            >
              {trade.outputAmount.toSignificant(6)}
              {isBSC(chainId) && trade.outputAmount.currency.symbol === 'ETH'
                ? BNB.symbol
                : trade.outputAmount.currency.symbol}
            </TruncatedText>
          </RowBetween>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={'black'}> Price Updated</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      {/* <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%', color: "black" }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%', color: "black" }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main style={{color: "black"}}>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}*/}
    </AutoColumn>
  )
}

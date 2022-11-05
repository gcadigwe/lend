import { RowBetween, RowFixed } from '../Row'

import { AutoColumn } from '../Column'
import BlockchainLogo from '../BlockchainLogo'
import { ButtonPrimary } from '../Button'
import { ChainTransferState, CrosschainChain } from '../../state/crosschain/actions'
import { ChevronRight } from 'react-feather'
import { Currency } from '@spherium/swap-sdk'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'
import { Text } from 'rebass'
import { Trade } from '@spherium/swap-sdk'
import { TruncatedText } from './styleds'
import styled from 'styled-components'
import { useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import TransferFee from './TransferFee'
import { GreyCard } from 'components/Card'
import { TYPE } from 'theme'
import QuestionHelper from 'components/QuestionHelper'
import { useActiveWeb3React } from 'hooks'
import DoubleArrow from '../../assets/images/double-arrow.svg'
import { shortenAddress } from '../../utils'
import useWindowDimensions from 'hooks/useWindowDimensions'

interface NotStartedProps {
  activeChain?: string
  transferTo?: string
  currency?: Currency | null
  value?: any
  trade?: Trade
  changeTransferState: (state: ChainTransferState) => void
  tokenTransferState: ChainTransferState
}

const ChainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  text-align: center;
  border-radius: 12px;
`
const DoubleArrowWrapper = styled.div`
  z-index: 1;
  height: 0px;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: flex-end;
`
const ChainItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.2s ease-in-out;
  border-radius: 12px;
  img {
    margin: auto;
    margin-bottom: 0.5rem;
  }
`
const ChainMessage = styled.p`
  font-size: 0.85rem;
  line-height: 1.25rem;
  a {
    font-weight: bold;
    color: ${({ theme }) => theme.primary1};
    cursor: pointer;
    outline: none;
    text-decoration: none;
    margin-left: 4px;
    margin-right: 4px;
  }
`

export default function NotStarted({
  activeChain,
  transferTo,
  currency,
  value,
  trade,
  changeTransferState,
  tokenTransferState
}: NotStartedProps) {
  const { MakeApprove } = useCrosschainHooks()

  const formatValue = (value: string) => {
    return parseFloat(parseFloat(value).toFixed(6)).toString()
  }

  const { chainId, account } = useActiveWeb3React()
  const { currentToken } = useCrosschainState()
  const { width } = useWindowDimensions()

  return (
    <AutoColumn
      gap={'md'}
      style={{ display: 'flex', height: '100%', justifyContent: 'space-between', flexDirection: 'column' }}
    >
      <div>
        <div
          style={{
            background: 'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)',
            minHeight: 156,
            borderRadius: 8,
            maxWidth: 380,
            width: '100%'
          }}
        >
          <RowBetween
            align="flex-end"
            style={{
              alignItems: 'center',
              borderRadius: 8,
              paddingTop: 20,
              paddingLeft: 25
            }}
          >
            <RowFixed gap={'0px'} style={{ width: 'auto' }}>
              {currency ? (
                <CurrencyLogo size="24px" currency={currency} style={{ marginBottom: '-3px', marginRight: '12px' }} />
              ) : (
                <CurrencyLogo
                  size="24px"
                  currency={currentToken}
                  style={{ marginBottom: '-3px', marginRight: '12px' }}
                />
              )}
            </RowFixed>
            <RowFixed gap={'0px'} style={{ display: 'block', marginLeft: 25 }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 500, opacity: 0.6 }}>Your asset</span>
              <Text fontSize={16} fontWeight={500}>
                {formatValue(value)}
                {currentToken.symbol}
              </Text>
            </RowFixed>
            <DoubleArrowWrapper>
              <div style={{ display: 'flex', flexDirection: 'column', paddingRight: 10 }}>
                <img src={DoubleArrow} />
              </div>
            </DoubleArrowWrapper>
          </RowBetween>

          <RowFixed gap={'0px'} style={{ margin: '1.5rem auto' }}>
            <ChainContainer
              style={{
                paddingBottom: 20,
                paddingTop: 22,
                margin: '0px 25px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
                gap: 20
              }}
            >
              <RowBetween style={{ justifyContent: 'space-between' }}>
                <Text color={'rgba(255, 255, 255, 0.7)'} fontSize={ width < 500 ? 12 : 14} fontWeight={700}>
                  {width < 500 ? 'Destination' : 'Destination Address'}
                </Text>
                <Text color={'rgba(255, 255, 255, 0.7)'} fontSize={ width < 500 ? 12 : 14} fontWeight={700}>
                  {account && shortenAddress(account)}
                </Text>
              </RowBetween>

              <RowBetween style={{ justifyContent: 'space-between' }}>
                <Text color={'rgba(255, 255, 255, 0.7)'} fontSize={ width < 500 ? 12 : 14} fontWeight={700}>
                  Transfer Mode
                </Text>
                <Text color={'#6BE4B9'} fontSize={ width < 500 ? 12 : 14} fontWeight={'bold'}>
                  {activeChain} to {transferTo}
                </Text>
              </RowBetween>

            </ChainContainer>
          </RowFixed>
        </div>
      </div>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          padding: 5
        }}
      >
        <RowBetween>
          {(tokenTransferState === ChainTransferState.TransferFee ||
            tokenTransferState === ChainTransferState.TransferFeeCompleted ||
            tokenTransferState === ChainTransferState.NotStarted ||
            tokenTransferState === ChainTransferState.FEEApprovalPending) && (
            <TransferFee
              activeChain={activeChain}
              transferTo={transferTo}
              currency={currency}
              value={value}
              trade={trade}
              changeTransferState={changeTransferState}
              tokenTransferState={tokenTransferState}
            />
          )}
        </RowBetween>
        <RowFixed style={{ width: '100%' }}>
          {tokenTransferState === ChainTransferState.NotStarted && (
            <GreyCard style={{ textAlign: 'center' }}>
              <TYPE.main mb="4px">Approve Transfer</TYPE.main>
            </GreyCard>
          )}

          <ButtonPrimary
            disabled={
              tokenTransferState === ChainTransferState.NotStarted ||
              tokenTransferState === ChainTransferState.TransferFeeCompleted
                ? false
                : true
            }
            onClick={() => {
              MakeApprove().catch(console.error)
              changeTransferState(ChainTransferState.ApprovalPending)
            }}
          >
            Approve Transfer
          </ButtonPrimary>
        </RowFixed>
      </div>
    </AutoColumn>
  )
}

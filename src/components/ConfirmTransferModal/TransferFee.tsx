import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import { ButtonPrimary } from '../Button'
import { ChainTransferState } from '../../state/crosschain/actions'
import { Currency } from '@spherium/swap-sdk'
import React from 'react'
import { Text } from 'rebass'
import { Trade } from '@spherium/swap-sdk'
import { Dots, TruncatedText } from './styleds'
import styled from 'styled-components'
import { useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import { useActiveWeb3React } from 'hooks'
import SuccessIcon from '../../assets/images/success.png'
import { ExternalLink } from 'theme/components'
import { ETHERSCAN_PREFIXES } from 'utils'
import useWindowDimensions from 'hooks/useWindowDimensions'

interface TransferFeeProps {
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
  flex-direction: row;
  width: 100%;
  justify-content: center;
  text-align: center;
  border-radius: 12px;
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

export default function TransferFee({
  activeChain,
  transferTo,
  currency,
  value,
  trade,
  changeTransferState,
  tokenTransferState
}: TransferFeeProps) {
  const { MakeFeeApproval } = useCrosschainHooks()

  const { crosschainFee, crosschainTransferStatus } = useCrosschainState()
  const { account, chainId } = useActiveWeb3React()
  const { feeTxHash } = useCrosschainState()
  const { width } = useWindowDimensions()

  const formatValue = (value: string) => {
    return parseFloat(parseFloat(value).toFixed(6)).toString()
  }

  return (
    <AutoColumn gap={'md'} style={{ display: 'block', width: '100%', height: '100%', justifyContent: 'center' }}>
      {tokenTransferState === ChainTransferState.TransferFeeCompleted && (
        <>
          {chainId && (
            <ExternalLink
              href={`https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}/tx/${feeTxHash}`}
              style={{ fontSize: '14px', justifyContent: 'center', display: 'flex', padding: 10 }}
            >
              Transaction submitted.
              {chainId === 97 || chainId === 56
                ? ' View on BscScan Explorer'
                : chainId === 137 || chainId === 80001
                ? 'View on Polygon Explorer'
                : chainId === 43113 || chainId === 43114
                ? 'View on Avalanche Explorer'
                : chainId === 42161 || chainId === 421611
                ? 'View on Arbiscan'
                : ' View on EtherScan Explorer'}
            </ExternalLink>
          )}
        </>
      )}
      <div
        style={{
          backgroundColor: 'rgba(123, 119, 211, 0.17)',
          height: 56,
          borderRadius: 8,
          maxWidth: 380,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          width: '100%',
          marginBottom: 20
        }}
      >
        <RowBetween align="flex-end" style={{ alignItems: 'center', borderRadius: 8, paddingTop: 5 }}>
          <RowFixed gap={'0px'} style={{ display: 'block', marginLeft: 7 }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, fontWeight: 500 }}>Estimated fee:</span>
            <Text fontSize={14} fontWeight={500} color={'rgba(255, 255, 255, 0.7)'}>
              {parseFloat(crosschainFee).toFixed(10)}
              {chainId === 56 || chainId === 97
                ? 'BNB'
                : chainId === 43113 || chainId === 43114
                ? 'AVAX'
                : chainId === 137 || chainId === 80001
                ? 'MATIC'
                : 'ETH'}
            </Text>
          </RowFixed>
          <RowFixed style={{ width: '100%', justifyContent: 'end', marginRight: 7 }}>
            {tokenTransferState === ChainTransferState.TransferFeeCompleted ? (
              <>
                <div
                  style={{
                    maxWidth: 114,
                    width: '100%',
                    display: 'flex',
                    height: 34,
                    fontSize: 12,
                    backgroundColor: 'rgba(87, 180, 145, 0.31)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 20
                  }}
                >
                  <RowBetween style={{ justifyContent: 'center' }}>
                    <img src={SuccessIcon} alt="success" width={23} style={{ marginRight: 5 }} />
                    Transferred
                  </RowBetween>
                </div>
              </>
            ) : (
              <>
                <ButtonPrimary
                  style={{ width: width < 500 ? 100 : 125, height: width < 500 ? 35 :  45, fontSize: 12 }}
                  onClick={() => {
                    MakeFeeApproval().catch(console.error)
                    //changeTransferState(ChainTransferState.ApprovalPending)
                  }}
                >
                  {crosschainTransferStatus === ChainTransferState.FEEApprovalPending ? (
                    <Dots>Transferring</Dots>
                  ) : (
                    <>Send Fee</>
                  )}
                </ButtonPrimary>
              </>
            )}
          </RowFixed>
        </RowBetween>
      </div>
    </AutoColumn>
  )
}

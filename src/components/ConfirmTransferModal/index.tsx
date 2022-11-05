import React, { useEffect, useState } from 'react'

import ApprovalComplete from './ApprovalComplete'
import ApprovalPending from './ApprovalPending'
import { ChainTransferState, CrosschainChain } from '../../state/crosschain/actions'
import { CloseIcon } from '../../theme/components'
import { Currency } from '@spherium/swap-sdk'
import Modal from '../Modal'
import NotStarted from './NotStarted'
import { RowBetween } from '../Row'
import { Trade } from '@spherium/swap-sdk'
import TransferComplete from './TransferComplete'
import TransferPending from './TransferPending'
import styled from 'styled-components'
import { useCrosschainState } from '../../state/crosschain/hooks'
import TransferFailed from './TransferFailed'
import { BreakCrosschainSwap } from 'state/crosschain/hooks'

interface ConfirmTransferProps {
  isOpen: boolean
  onDismiss: () => void
  activeChain?: string
  transferTo?: CrosschainChain
  currency?: Currency | null
  value?: string
  trade?: Trade
  changeTransferState: (state: ChainTransferState) => void
  tokenTransferState: ChainTransferState
}

const ModalContainer = styled.div`
  padding: 32px 32px 40px 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  h5 {
    font-weight: 500;
    margin-bottom: 24px;
    display: block;
    text-align: center;
    margin-top: 1rem;
    font-size: 25px;
  }

  @media (max-width: 365px) {
    h5 {
      font-size: 20px;
    }
  }
`

export default function ConfirmTransferModal({
  isOpen,
  onDismiss,
  activeChain,
  transferTo,
  currency,
  value,
  trade,
  changeTransferState,
  tokenTransferState
}: ConfirmTransferProps) {
  const { currentToken, transferAmount } = useCrosschainState()

  const [title, setTitle] = useState('')

  useEffect(() => {
    switch (tokenTransferState) {
      case ChainTransferState.TransferFee:
        setTitle('Approve Your Transfer')
        break
      case ChainTransferState.ApprovalPending:
        setTitle('Approval Pending')
        break
      case ChainTransferState.ApprovalComplete:
        setTitle('Approved! Now Start Transfer')
        break
      case ChainTransferState.TransferPending:
        setTitle('Transfer Pending')
        break

      case ChainTransferState.TransferFailed:
        setTitle('Transfer Failed')
        break

      case ChainTransferState.TransferComplete:
        setTitle('Transfer Completed')
        break
      default:
    }
  }, [tokenTransferState])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        <div>
          <RowBetween style={{ justifyContent: 'flex-end' }}>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <h5>{title}</h5>
        </div>
        {(tokenTransferState === ChainTransferState.TransferFee ||
          tokenTransferState === ChainTransferState.TransferFeeCompleted ||
          tokenTransferState === ChainTransferState.NotStarted ||
          tokenTransferState === ChainTransferState.FEEApprovalPending) && (
          <NotStarted
            activeChain={activeChain}
            transferTo={transferTo?.name}
            currency={currency}
            value={value}
            trade={trade}
            changeTransferState={changeTransferState}
            tokenTransferState={tokenTransferState}
          />
        )}

        {tokenTransferState === ChainTransferState.ApprovalPending && <ApprovalPending />}

        {tokenTransferState === ChainTransferState.ApprovalComplete && (
          <ApprovalComplete changeTransferState={changeTransferState} />
        )}

        {tokenTransferState === ChainTransferState.TransferPending && (
          <TransferPending changeTransferState={changeTransferState} />
        )}

        {tokenTransferState === ChainTransferState.TransferComplete && (
          <TransferComplete
            activeChain={activeChain}
            transferTo={transferTo?.name}
            onDismiss={onDismiss}
            currentToken={currentToken}
            transferAmount={transferAmount}
          />
        )}

        {tokenTransferState === ChainTransferState.TransferFailed && <TransferFailed onDismiss={onDismiss} />}
      </ModalContainer>
    </Modal>
  )
}

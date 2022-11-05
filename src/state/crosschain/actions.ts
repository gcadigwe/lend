import { createAction } from '@reduxjs/toolkit'
import { ChainId } from '@spherium/swap-sdk'

export enum ProposalStatus {
  INACTIVE = '0',
  ACTIVE = '1',
  PASSED = '2',
  EXECUTED = '3',
  CANCELLED = '4'
}

export interface CrosschainToken {
  name: string
  address: string
  assetBase: string
  symbol: string
  decimals: number
}

export interface CrosschainChain {
  name: string
  chainID: string
  symbol?: string
  imageUri?: string
  resourceId?: string
  isNativeWrappedToken?: boolean
  assetBase?: string
}

export enum ChainTransferState {
  TransferFee = 'TRANSFER_FEE',
  TransferFeeCompleted = 'TRANSFER_FEE_COMPLETED',
  NotStarted = 'NOT_STARTED',
  ApprovalPending = 'APPROVE_PENDING',
  FEEApprovalPending = 'Fee_Approval_Pending',
  ApprovalComplete = 'APPROVE_COMPLETE',
  TransferPending = 'TRANSFER_PENDING',
  TransferComplete = 'TRANSFER_COMPLETE',
  TransferFailed = 'TRANSFER_FAILED'
}

export interface SwapDetails {
  status: ProposalStatus
  voteCount: number
}

export interface PendingTransfer {
  currentSymbol?: string
  targetSymbol?: string
  assetBase?: string
  amount?: string
  decimals?: number
  name?: string
  address?: string
  status?: string
  votes?: number
}

export const setCrosschainRecipient = createAction<{ address: string }>('crosschain/set-recipient')
export const setCurrentTxID = createAction<{ txID: string }>('crosschain/set-currentTxID')
export const setAvailableChains = createAction<{ chains: Array<CrosschainChain> }>('crosschain/set-availableChains')
export const setAvailableTokens = createAction<{ tokens: Array<CrosschainToken> }>('crosschain/set-availableTokens')
export const setTargetTokens = createAction<{ targetTokens: Array<CrosschainToken> }>('crosschain/set-targetTokens')
export const setCurrentChain = createAction<{ chain: CrosschainChain }>('crosschain/set-currentChain')
export const setTargetChain = createAction<{ chain: CrosschainChain | undefined }>('crosschain/set-target-Chain')
export const setCurrentToken = createAction<{ token: CrosschainToken }>('crosschain/set-currentToken')
export const setCurrentTokenBalance = createAction<{ balance: string }>('crosschain/set-balance')
export const setTransferAmount = createAction<{ amount: string }>('crosschain/set-transfer-amount')
export const setCrosschainFee = createAction<{ value: string | any }>('crosschain/set-fee')
export const setBridgeTVL = createAction<{ loading?: boolean; bridgeTVL?: string; error: string | null }>(
  'crosschain/bridge-tvl'
)
export const setSPHRItoETH = createAction<{ value: string }>('crosschain/set-spriToEth')
export const setOriginalChain = createAction<{ chain: ChainId | undefined }>('crosschain/set-origin')
export const setTVL = createAction<{ value: any }>('crosschain/set-tvl')
export const setTokenAmount = createAction<{ value: any }>('crosschain/set-tokenAmount')
export const setTokenAmountLocked = createAction<{ value: any }>('crosschain/set-tokenAmountLocked')

export const setFeeTxHash = createAction<{ value: string }>('crosschain/set-feehash')

export const setErrorMsg = createAction<{ value: string }>('crosschain/set-error')

export const setCrosschainTransferStatus = createAction<{ status: ChainTransferState }>(
  'crosschain/set-transfer-status'
)
export const setCrosschainDepositConfirmed = createAction<{ confirmed: boolean }>('crosschain/set-deposit-confirmed')
export const setCrosschainSwapDetails = createAction<{ details: SwapDetails }>('crosschain/set-swap-details')
export const setPendingTransfer = createAction<{ pendingTransfer: PendingTransfer }>('crosschain/set-pending-transfer')

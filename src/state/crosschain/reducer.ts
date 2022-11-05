import {
  ChainTransferState,
  CrosschainChain,
  CrosschainToken,
  PendingTransfer,
  ProposalStatus,
  SwapDetails,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainDepositConfirmed,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapDetails,
  setCrosschainTransferStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID,
  setPendingTransfer,
  setTargetChain,
  setTargetTokens,
  setTransferAmount,
  setErrorMsg,
  setSPHRItoETH,
  setFeeTxHash,
  setOriginalChain,
  setTVL,
  setTokenAmount,
  setTokenAmountLocked,
  setBridgeTVL
} from './actions'

import { createReducer } from '@reduxjs/toolkit'
import { ChainId, CurrencyAmount } from '@spherium/swap-sdk'

export interface CrosschainState {
  readonly currentRecipient: string
  readonly currentTxID: string
  readonly availableChains: Array<CrosschainChain>
  readonly availableTokens: Array<CrosschainToken>
  readonly currentChain: CrosschainChain
  readonly targetChain: CrosschainChain | undefined
  readonly targetTokens: Array<CrosschainToken>
  readonly currentToken: CrosschainToken
  readonly currentBalance: CurrencyAmount | any
  readonly transferAmount: string
  readonly errorMsg: string
  readonly crosschainFee: string
  readonly sphriToEth: string
  readonly feeTxHash: string
  readonly origin: ChainId | undefined
  readonly tvl: any
  readonly tokenAmount: any
  readonly tokenAmountLocked: any

  readonly crosschainTransferStatus: ChainTransferState
  readonly swapDetails: SwapDetails
  readonly depositConfirmed: boolean
  readonly pendingTransfer: PendingTransfer
  readonly bridgeTVL: { loading?: boolean; bridgeTVL?: string; error: string | null }
}

export const initialState: CrosschainState = {
  currentRecipient: '',
  currentTxID: '',
  availableChains: new Array<CrosschainChain>(),
  availableTokens: new Array<CrosschainToken>(),
  targetTokens: new Array<CrosschainToken>(),
  currentChain: {
    name: '',
    chainID: ''
  },
  targetChain: {
    name: '',
    chainID: ''
  },
  currentToken: {
    name: '',
    address: '',
    assetBase: '',
    symbol: '',
    decimals: 18
  },
  currentBalance: undefined,
  errorMsg: '',
  transferAmount: '',
  crosschainFee: '',
  tvl: undefined,
  feeTxHash: '',
  sphriToEth: '',
  crosschainTransferStatus: ChainTransferState.NotStarted,
  swapDetails: {
    status: ProposalStatus.INACTIVE,
    voteCount: 0
  },
  depositConfirmed: false,
  pendingTransfer: {},
  origin: undefined,
  tokenAmount: [],
  tokenAmountLocked: undefined,
  bridgeTVL: { loading: false, error: null }
}

export default createReducer<CrosschainState>(initialState, builder =>
  builder
    .addCase(setCrosschainRecipient, (state, { payload: { address } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        currentRecipient: address
      }
    })
    .addCase(setPendingTransfer, (state, { payload: { pendingTransfer } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        pendingTransfer
      }
    })
    .addCase(setCurrentTxID, (state, { payload: { txID } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        currentTxID: txID
      }
    })
    .addCase(setAvailableChains, (state, { payload: { chains } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        availableChains: chains
      }
    })
    .addCase(setAvailableTokens, (state, { payload: { tokens } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        availableTokens: tokens
      }
    })
    .addCase(setTargetTokens, (state, { payload: { targetTokens } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        targetTokens
      }
    })
    .addCase(setCurrentChain, (state, { payload: { chain } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        currentChain: chain
      }
    })
    .addCase(setErrorMsg, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        errorMsg: value
      }
    })
    .addCase(setTargetChain, (state, { payload: { chain } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        targetChain: chain
      }
    })
    .addCase(setCurrentToken, (state, { payload: { token } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        currentToken: token
      }
    })
    .addCase(setCurrentTokenBalance, (state, { payload: { balance } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        currentBalance: balance
      }
    })
    .addCase(setTransferAmount, (state, { payload: { amount } }) => {
      const currentState = { ...initialState, ...state }
      console.log(`For cross chain, transfer amount will be ${amount}`)
      return {
        ...currentState,
        transferAmount: amount
      }
    })
    .addCase(setCrosschainFee, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        crosschainFee: value
      }
    })
    .addCase(setSPHRItoETH, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        sphriToEth: value
      }
    })
    .addCase(setFeeTxHash, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        feeTxHash: value
      }
    })
    .addCase(setCrosschainTransferStatus, (state, { payload: { status } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        crosschainTransferStatus: status
      }
    })
    .addCase(setCrosschainSwapDetails, (state, { payload: { details } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        swapDetails: details
      }
    })
    .addCase(setCrosschainDepositConfirmed, (state, { payload: { confirmed } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        depositConfirmed: confirmed
      }
    })

    .addCase(setOriginalChain, (state, { payload: { chain } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        origin: chain
      }
    })
    .addCase(setTVL, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        tvl: value
      }
    })
    .addCase(setTokenAmount, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        tokenAmount: value
      }
    })
    .addCase(setTokenAmountLocked, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        tokenAmountLocked: value
      }
    })
    .addCase(setBridgeTVL, (state, { payload }) => {
      const currentState = { ...initialState, ...state }
      return {
        ...currentState,
        bridgeTVL: payload
      }
    })
)

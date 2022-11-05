import { createReducer } from '@reduxjs/toolkit'
import { fetchPairList } from './actions'

// @test only
import * as data from '../../pages/Pairs/data.json'
export interface SinglePair {
  address: string
  name: string
  liquidity: string
  volume24: string
  volume7: string
  fees7: string
  fpl7: string
}

export interface TopPair {
  pairAddress: string
  pairName: string
  chainId: string

  tokenAAddress: string
  tokenABalance: number
  tokenATicker: string
  tokenAUSDExRate: number
  tokenALogo: string

  tokenBAddress: string
  tokenBBalance: number
  tokenBTicker: string
  tokenBUSDExRate: number
  tokenBLogo: string

  totalLiquidity: number
  timeStamp: number
  liquidity24H: string
  liquidity12H: string
  totalLiquidityPercent?: number
  totalLiquidity24H?: number
  totalLiquidity24HrsPercent?: number
  totalLiquidity12H?: number
  totalLiquidity12HrsPercent?: number
  totalFees: string
}

export type PairState = {
  topPairList: TopPair[]
  isErrorTopPairs: boolean
  isPendingTopPairs: boolean
  errorMessage: string
  showing: number
  total: number
  numberOfPages: number
}

const initialState: PairState = {
  topPairList: data.topPairsData as TopPair[],
  isErrorTopPairs: false,
  isPendingTopPairs: false,
  errorMessage: '',
  showing: 0,
  numberOfPages: 0,
  total: 0
}

export default createReducer<PairState>(initialState, builder => {
  builder
    .addCase(fetchPairList.pending, (state, { payload: { url, requestId } }) => {
      return {
        ...state,
        isPendingTopPairs: true,
        isErrorTopPairs: false,
        topPairList: []
      }
    })
    .addCase(fetchPairList.fulfilled, (state, { payload: { url, data, requestId } }) => {
      return {
        ...state,
        isPendingTopPairs: false,
        isErrorTopPairs: false,
        topPairList: data.data,
        total: data.total,
        numberOfPages: data.numberOfPages,
        showing: data.showing
      }
    })
    .addCase(fetchPairList.rejected, (state, { payload: { url, errorMessage, requestId } }) => {
      return {
        ...state,
        isPendingTopPairs: false,
        isErrorTopPairs: true,
        topPairList: [],
        errorMessage: errorMessage
      }
    })
})

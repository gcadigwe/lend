import { createAction, ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { TopPair } from './reducer'
export const GetPairList = createAction<string>('pair/getList')
export const GetPairDetails = createAction<string>('pair/getDetails')

export const fetchPairList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{ url: string; data: any; requestId: string }>
  rejected: ActionCreatorWithPayload<{ url: string; errorMessage: string; requestId: string }>
}> = {
  pending: createAction('topPairs/fetchPairList/pending'),
  fulfilled: createAction('topPairs/fetchPairList/fulfilled'),
  rejected: createAction('topPairs/fetchPairList/rejected')
}

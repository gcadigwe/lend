import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import getPairList from 'state/pairs/getPairList'
import { fetchPairList } from './actions'
import { nanoid } from '@reduxjs/toolkit'
import { TopPair } from './reducer'

export function useFetchPairsCallback(): (
  listUrl: string,
  pageSize: number,
  lastEvaluatedKey: any,
  search: string,
  sort: string,
  sendDispatch?: boolean
) => Promise<TopPair[]> {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    async (apiUrl: string, pageSize: number, pageNumber: number, search: string, sort: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchPairList.pending({ url: apiUrl, requestId }))
      return getPairList(apiUrl, pageSize, pageNumber, search, sort)
        .then(data => {
          sendDispatch && dispatch(fetchPairList.fulfilled({ url: apiUrl, data, requestId }))
          return data
        })
        .catch(error => {
          console.debug(`Failed to get list at url ${apiUrl}`, error)
          sendDispatch && dispatch(fetchPairList.rejected({ url: apiUrl, errorMessage: error.message, requestId }))
          throw error
        })
    },
    [dispatch]
  )
}

import { createAction } from '@reduxjs/toolkit'
import { SinglePair } from './hooks'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
// get single pair

export const getSinglePairRequest = createAction<{ loading: boolean }>('swap/getSinglePairRequest')

export const getSinglePairSuccess = createAction<{
  currentPair: SinglePair | undefined
}>('swap/getSinglelPairSuccess')

export const getSinglePairFail = createAction<{ error: string }>('swap/getSinglelPairFail')

export const setAciveSwapPair = createAction<{
  pairAddress: string
  pairName: string
}>('swap/setActiveSwapPair')

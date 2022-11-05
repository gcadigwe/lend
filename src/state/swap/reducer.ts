import { createReducer } from '@reduxjs/toolkit'
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
  getSinglePairRequest,
  getSinglePairFail,
  getSinglePairSuccess,
  setAciveSwapPair
} from './actions'
import { SinglePair } from './hooks'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: ''
  },
  [Field.OUTPUT]: {
    currencyId: ''
  },
  recipient: null
}

export default createReducer<SwapState>(initialState, builder =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId
          },
          independentField: field,
          typedValue: typedValue,
          recipient
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)

const swapPairInitalState: {
  currentPair: SinglePair | undefined
  loading: boolean | null
  error: string | null
} = {
  currentPair: undefined,
  loading: null,
  error: null
}

export const currentSwapPairReducer = createReducer(swapPairInitalState, builder =>
  builder
    .addCase(getSinglePairRequest, (state, { payload: { loading } }) => {
      return {
        ...state,
        loading
      }
    })
    .addCase(getSinglePairSuccess, (state, { payload: { currentPair } }) => {
      return {
        error: null,
        currentPair,
        loading: false
      }
    })
    .addCase(getSinglePairFail, (state, { payload: { error } }) => {
      return {
        ...state,
        error,
        loading: false
      }
    })
)

const activePairInitialState: {
  pairAddress: string
  pairName: string
} = {
  pairAddress: '0xD1322ba305066a15814Ca9363e21204285ab42e2',
  pairName: 'DAI-WETH'
}

export const activeSwapPair = createReducer(activePairInitialState, builder =>
  builder.addCase(setAciveSwapPair, (state, { payload: { pairAddress, pairName } }) => {
    return {
      pairName,
      pairAddress
    }
  })
)

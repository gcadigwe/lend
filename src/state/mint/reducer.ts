import { createReducer } from '@reduxjs/toolkit'
import { Field, resetMintState, typeInput, setCurrencyA, setCurrencyB } from './actions'

export interface MintState {
  readonly independentField: Field
  readonly currency_A: string
  readonly currency_B: string
  readonly typedValue: string

  readonly otherTypedValue: string // for the case when there's no liquidity
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
  currency_A: '',
  currency_B: ''


}

export default createReducer<MintState>(initialState, builder =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue
          }
        }
        // they're typing into a new field, store the other value
        else {
          return {
            ...state,
            independentField: field,
            typedValue,
            otherTypedValue: state.typedValue
          }
        }
      } else {
        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: ''
        }
      }
    })
    .addCase(setCurrencyA, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currency_A: value
      }
    })

    .addCase(setCurrencyB, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currency_B: value
      }
    })
)

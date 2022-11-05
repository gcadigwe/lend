import { setUdUser, setLogoutListener } from './actions'

import { createReducer } from '@reduxjs/toolkit'

export interface WalletState {
  readonly udUser: any
  readonly logoutListener: any

}

export const initialState: WalletState = {
  udUser: undefined,
  logoutListener: undefined

}

export default createReducer<WalletState>(initialState, builder =>
  builder.addCase(setUdUser, (state, { payload: { user } }) => {
    const currentState = { ...initialState, ...state }
    return {
      ...currentState,
      udUser: user
    }
  })
  .addCase(setLogoutListener, (state, { payload: { action } }) => {
    const currentState = { ...initialState, ...state }
    return {
      ...currentState,
      logoutListener: action
    }
  })
)

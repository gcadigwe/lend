import { createAction } from '@reduxjs/toolkit'


export const setUdUser = createAction<{ user: any }>('wallet/set-udUser')
export const setLogoutListener = createAction<{ action: any }>('wallet/set-logout')


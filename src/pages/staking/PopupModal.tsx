import React from 'react'

import { CardContainer, CardBackground } from './Popupstyle'
import { useWalletModalToggle } from '../../state/application/hooks'

export const PopupModal = ({ open, onClose }: any) => {
  const toggleWalletModal = useWalletModalToggle()

  console.log(open)

  return (
    <CardBackground open={open}>
      <CardContainer>
        <h1>Please connect with wallet</h1>
        <button
          onClick={() => {
            toggleWalletModal()
            onClose()
          }}
        >
          Connect wallet
        </button>
      </CardContainer>
    </CardBackground>
  )
}

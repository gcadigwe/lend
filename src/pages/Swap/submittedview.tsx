import React from 'react'

import { AutoColumn, ColumnCenter } from '../../components/Column'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import { TYPE, CloseIcon, CustomLightSpinner } from '../../theme'
import { AlertCircle } from 'react-feather'
import Circle from '../../assets/images/blue-loader.svg'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
  background-color: #fae7ee;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} style={{ color: 'red' }} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        <TYPE.subHeader>Confirm this transaction in your wallet</TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({ onDismiss, text }: { onDismiss: () => void; text: string }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <AutoColumn gap="100px" justify={'center'}>
        <TYPE.subHeader style={{ color: '#EE5C69', fontSize: 18, fontWeight: 500 }}>
          You cannot change networks automatically in this wallet. Please change network manually.
        </TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

import { AutoColumn } from '../Column'
import { ButtonOutlined } from '../Button'
import React from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'

import { useCrosschainState } from 'state/crosschain/hooks'
import { AlertTriangle } from 'react-feather'


export default function TransferFailed({
  onDismiss
}: {
  onDismiss: () => void
}) {

    const { errorMsg } = useCrosschainState()
  return (
    <>
      <AutoColumn gap="12px" justify={'center'}>
    <AlertTriangle width={70} height={70} fill={'red'}/>

        <RowFixed style={{ width: '100%' }}>
          <Text fontSize={17} textAlign="center" style={{ lineHeight: '20px' }}>
            Transfer Failed. Please try again.
            <Text style={{color: 'red', fontWeight: 700}}>Error:</Text>
           <Text style={{color: 'red'}}> {errorMsg}</Text>
          </Text>
        </RowFixed>
       
        <RowFixed style={{ width: '100%' }}>
          <ButtonOutlined onClick={onDismiss}>Close</ButtonOutlined>
        </RowFixed>
      </AutoColumn>
    </>
  )
}

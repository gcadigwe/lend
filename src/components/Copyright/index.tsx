import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'

import { AutoColumn } from '../Column'

import styled from 'styled-components'

import { RowBetween } from 'components/Row'

const Title = styled.p`
  display: flex;
  width: 100%;
  align-items: center;
  pointer-events: auto;
  font-size: 14px;
  opacity: 0.7;
  padding-right: 64px;
`

const AppWrapper = styled.footer`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: self-end;
  flex-direction: row;

  @media (max-width: 845px) {
    display: none;
  }
  
  @media (max-width: 500px) {
    display: none;
  }
  height: 55px;
`

const ContentWrapper = styled(RowBetween)`
  margin-left: 75px;
  margin-right: 32px;
  align-items: center;
  margin-top: 14px;
`

export default function CopyRight() {
  return (
    <AppWrapper>
      <Title>
        <hr
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            borderWidth: 0,
            color: 'rgba(255, 255, 255, 0.07)',
            height: 1,
            width: '88%',
            margin: 0
          }}
        />
        Spherium Finance
      </Title>
    </AppWrapper>
  )
}

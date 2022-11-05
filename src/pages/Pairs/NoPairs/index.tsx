import React from 'react'
import PlaceHolder from '../../../assets/images/pairsPlaceholder.svg'
import styled from 'styled-components'
import { AddLiquidityBtn, CreatePoolBtn } from '../Search/Buttons'

const NoPairsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transform: translateY(-10%);
  & > div {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  #btn-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    width: 100%;
  }

  #title {
    margin: 1rem 0px;
    color: #2a324a;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
  }
`

const NoPairs = () => {
  return (
    <NoPairsWrapper>
      <div>
        <div>
          <img src={PlaceHolder} alt="No Pairs" />
        </div>
        <div id="title">
          <p>No Liquidity Pair Available</p>
        </div>
        <div id="btn-wrapper">
          <AddLiquidityBtn />
          <CreatePoolBtn />
        </div>
      </div>
    </NoPairsWrapper>
  )
}

export default NoPairs

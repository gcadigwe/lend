import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ArrowDown from '../../../assets/images/arrow-down-add-liquidity.svg'

const CreatePool = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8px;
  color: #2a324a;
  font-weight: 600;
  width: 100%;
  height: 60px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  & > a {
    text-decoration: none;
  }

  :hover {
    border: 2px solid #2E37F2;
  }

  :focus {
    background: #2E37F2;
    color: #FAFBFF;
  }
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  max-width: 164px;
  `};


`

const AddLiquidity = styled(Link)`
  text-decoration: none;
  display: flex;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #2e37f2;
  border-radius: 8px;
  color: #ffffff;
  height: 60px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;

    p {
      margin-right: 5px;
      font-size: 15px;
    }

    & > div > img {
      display: inline-block;
      width: 20px;
      height: 20px;
    }
  }

  &:focus { 
    background-color: #2E37F2;
    border: 3px solid rgba(46, 55, 242, 0.22);
  }
  &:hover {
    background-color: #5B63FF;
  }
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  max-width: 164px;
  `};

`

export const CreatePoolBtn = () => {
  return <CreatePool to="/pool">Create Pool</CreatePool>
}

export const AddLiquidityBtn = () => {
  return (
    <AddLiquidity to="/pool">
      <div>
        <p>Add Liquidity</p>
        <div className="arrow-img">
          <img src={ArrowDown} alt="Arrow down" />
        </div>
      </div>
    </AddLiquidity>
  )
}

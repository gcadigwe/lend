import Account from 'components/Account'
import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import MobileHeader from 'components/MobileHeader'
import { useMedia } from 'react-use'

const Navbar = styled.div`
  display: grid;
  //grid-template-columns: 9fr 7fr;
  align-items: center;
  //height: 90px;
  //padding: 0 0.3rem;

  @media screen and (max-width: 680px) {
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    //height: 150px;
  }

  @media screen and (max-width: 500px) {
    display: block;
  }

`
const PageTitle = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 5px;
  border-left: none;
  height: 84px;
  
  & > * {
    font-family: 'Plus Jakarta Sans';
  }
  & #liq-title {
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    margin-right: 10px;
    margin-left: 17px;
    margin-bottom: 13px;

  }
  & #liq-subtitle {
    font-weight: 500;
    size: 16px;
    line-height: 14px;
    margin-top: 15px;
    top: 4px;
    left: 12px;
    position: relative;
  }

  @media screen and (max-width: 1000px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    #liq-title {
      margin-top: 5px;
    }
    #liq-subtitle {
      margin-top: -12px;
    }
  }

  @media screen and (max-width: 500px) {
    border: none;
    border-radius: 20px;
    position: relative;
    bottom: 8px;
    flex-direction: column;
    
    justify-content: center;
  }

`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
display: grid;
justify-content: flex-start;
  }

`

const LiquidityNavbar = () => {
  const below500 = useMedia('(max-width: 500px)')

  return (
    <Navbar>
    {/* <MobileHeader/> */}
      <PageTitle>
        <Text style={{display: "flex", width: "100%", alignItems: "center"}}>
          <TitleWrapper>
        <p id="liq-title">Liquidity Pair</p>
        {!below500 && (
            <p id="liq-subtitle">Hyperswap All Pool</p>
        )}
      
        </TitleWrapper>
        </Text>
      </PageTitle>
     
    </Navbar>
  )
}

export default LiquidityNavbar

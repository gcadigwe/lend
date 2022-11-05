
import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import Account from '../../components/Account'
import { useMedia } from 'react-use'
import Logo from '../../assets/images/spherium logo.png'
import { useActiveWeb3React } from 'hooks'



const Title = styled.a`
  display: flex;
  //background-color: #F1F4FF;
  padding: 0px 20px;
  width: 100%
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  height: 80px;
  margin-right: 26px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    margin-right: 0px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: auto;
`};
  :hover {
    cursor: pointer;
  }
`

const SpheriumIcon = styled.div`
  transition: transform 0.3s ease;
`

const Spherium = styled.p`
  width: 88px;
  height: 12.6px;
  font-size: 16px;
  margin: 5.4px 2.2px 29.3px 5px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.48px;
  text-align: right;
  color: #fff;


`


export default function MobileHeader() {

  const { account } = useActiveWeb3React()

  const below500 = useMedia('(max-width: 500px)')

  
  return (
    <>

          <Title style={{display: below500 ? 'flex' : "none"}}>
                <SpheriumIcon>
                  <img style={{ width: 35, marginRight: 8, display: below500 ? 'none' : "none" }} src={Logo} alt="logo" />
                </SpheriumIcon>
                <Spherium style ={{display : !account ? "flex" : "none"}}>
                 <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 21 }}>SPHERIUM</Text>
                </Spherium>
                <Account/>
              </Title>

    </>
  )
}

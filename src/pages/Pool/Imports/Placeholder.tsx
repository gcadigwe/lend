import React from 'react'
import { Link } from 'react-router-dom'
import PairNotFound from '../../../assets/images/pairNotfound.png'
import { Text } from 'rebass'
import styled from 'styled-components'
import useWindowDimensions from 'hooks/useWindowDimensions'

const PlaceholderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  flex-direction: column;
  position: relative;
  top: 100px;

  & > img {
    display: inline-block;
    margin-bottom: 20px;
  }

  & > #p-text {
    //width: 60%;
    font-size: 12px;
    font-weight: 400;
  }


`

const Placeholder = () => {
const { width } = useWindowDimensions()

  return (
    <PlaceholderWrapper>
      {/* <img src={PairNotFound} alt={'pairNotFound'} width={width < 500 ? 104 : 290} height={width < 500 ? 70 :200} /> */}
      <Text fontWeight={400} fontSize={12} style={{ display: 'flex' }}>
      No Liquidity Found <br/> or <br/> Connect to a wallet to view your liquidity.
      </Text>

      {/* <Link
        style={{
          padding: 15,
          border: '1px solid #828DB0',
          borderRadius: 10,
          textDecoration: 'none',
          color: '#000'
        }}
        to="/pool"
      >
        {' '}
        Import it{' '}
      </Link>{' '} */}
    </PlaceholderWrapper>
  )
}

export default Placeholder

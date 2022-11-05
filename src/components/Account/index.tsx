import { ChainId } from '@spherium/swap-sdk'
import DropdownSelect from '../../pages/Swap/dropdown'
import { RowBetween } from 'components/Row'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'hooks'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { useETHBalances } from 'state/wallet/hooks'
import styled from 'styled-components'
import { useMedia } from 'react-use'

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  color: white;
  pointer-events: auto;
  // background-color: rgba(255, 255, 255, 0.04);
  flex-direction: row;
  align-items: center;
  // padding: 10px;
  height: 50px;
  width: 100%;
  gap: 10px;
  border-radius: 8px;
  //white-space: nowrap;
  //width: 310px;
  cursor: pointer;
  // :focus {
  //   border: 1px solid blue;
  // }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: row;
   align-items: center;
 `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  margin-right: 5px;
      `};
`

const BalanceText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  //padding: 1.72rem 1rem;
  font-weight: 500;
  width: 100%;
  color: white;
  background-color: transparent;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;

  @media (max-width: 500px) {
    padding: 0px;
  }
`
const UpperSection = styled.div`
  position: relative;
  width: 100%;
  top: -14px;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }

  @media (max-width: 500px) {
    top: 0px;
  }
`
const ChainDropdown = styled.div`
  display: grid;
  color: white;
  font-size: 18px;
  cursor: pointer;
  background-image: linear-gradient(89.59deg, #85a2bd 0.51%, #aebd84 104.04%);
  border-radius: 38px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     margin-right: 0px;
    //  width: 50px;
 `};
`
const HeaderElement = styled.div`
  display: flex;
  z-index: 11;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.02);
  box-sizing: border-box;
  border-radius: 8px;
  align-items: flex-end;
  flex-direction: column-reverse;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      width: 100%;
      padding: 0px 0px 0px 10px;
`};
`

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  z-index: 111;
  background-color: transparent;

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//   display: block;
// `}; 
`

const Acccount = () => {
  const { account, chainId } = useActiveWeb3React()
  function currencyText() {
    if (chainId === 97 || chainId === 56) {
      return 'BNB'
    }
    if (chainId === 137 || chainId === 80001) {
      return 'MATIC'
    }
    if (chainId === 43113 || chainId === 43114) {
      return 'AVAX'
    } else return 'ETH'
  }

  const currencytxt = currencyText()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
    //[ChainId.RINKEBY]: 'Rinkeby',
    [ChainId.MAINNET]: 'Ethereum',
    // [ChainId.ARBITRUM_MAINNET]: 'Arbitrum',
    // [ChainId.FUJI]: 'Fuji',
    [ChainId.AVALANCHE]: 'Avalanche',
    [ChainId.BSC_MAINNET]: 'Binance Smart Chain',
    // [ChainId.BSC_TESTNET]: 'Binance TestNet',
    // [ChainId.MUMBAI]: 'Mumbai',
    [ChainId.MATIC]: 'Polygon'
  }

  const [, setNetwork] = useState(chainId !== undefined ? NETWORK_LABELS[chainId] : chainId)

  const below500 = useMedia('(max-width: 500px)')

  return (
    <UpperSection>
      <HeaderRow>
        <ButtonWrapper
          style={{
            justifyContent: 'flex-end'
          }}
        >
          <HeaderElement>
            <AccountElement active={!!account}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.5rem" pr="0.5rem" pt="0.5rem" pb="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} {currencytxt}
                </BalanceText>
              ) : null}

              <Web3Status />
              {chainId && account && NETWORK_LABELS[chainId] && (
                <ChainDropdown style={{ marginRight: '10px', height: 30 }}>
                  <RowBetween style={{ justifyContent: below500 ? 'center' : 'space-around' }}>
                    <DropdownSelect
                      options={NETWORK_LABELS}
                      active={NETWORK_LABELS[chainId]}
                      setActive={setNetwork}
                      color={'#fff'}
                      onDismiss={() => {}}
                    />
                  </RowBetween>
                </ChainDropdown>
              )}
            </AccountElement>
          </HeaderElement>
        </ButtonWrapper>
      </HeaderRow>
    </UpperSection>
  )
}

export default Acccount

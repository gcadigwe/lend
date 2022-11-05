import { JSBI, Token } from '@spherium/swap-sdk'
import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ChevronDown , X } from 'react-feather'
import { useAllTokenV1Exchanges } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { LightCard } from '../../components/Card'
import { BodyWrapper } from '../AppBody'
import { EmptyState } from '../MigrateV1/EmptyState'
import V1PositionCard from '../../components/PositionCard/V1'
import { Dots } from '../../components/swap/styleds'
import { useAddUserToken } from '../../state/user/hooks'
import { isTokenOnList } from '../../utils'
import { useCombinedActiveList } from '../../state/lists/hooks'


const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  padding: 10px;
  height: 5rem;
  font-size: 1rem;
  width: 100%;
  min-width: 20rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`

const Option = styled(FancyButton)<{ active: boolean }>`
  margin-right: 8px;
  :hover {
    cursor: pointer;
  }
  background-color: ${({ active, theme }) => active && theme.primary1};
  color: ${({ active, theme }) => (active ? theme.white : theme.text1)};
`

export default function Migrate() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  const [tokenSearch, setTokenSearch] = useState<string>('')
  const handleTokenSearchChange = useCallback(e => setTokenSearch(e.target.value), [setTokenSearch])

  // automatically add the search token
  const token = useToken(tokenSearch)
  const selectedTokenListTokens = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenListTokens, token ?? undefined)
  const allTokens = useAllTokens()
  const addToken = useAddUserToken()
  useEffect(() => {
    if (token && !isOnSelectedList && !allTokens[token.address]) {
      addToken(token)
    }
  }, [token, isOnSelectedList, addToken, allTokens])

  // get V1 LP balances
  const V1Exchanges = useAllTokenV1Exchanges()
  const V1LiquidityTokens: Token[] = useMemo(() => {
    return chainId
      ? Object.keys(V1Exchanges).map(exchangeAddress => new Token(chainId, exchangeAddress, 18, 'SPHRI-V1', 'SPHRI V1'))
      : []
  }, [chainId, V1Exchanges])
  const [V1LiquidityBalances, V1LiquidityBalancesLoading] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    V1LiquidityTokens
  )
  const allV1PairsWithLiquidity = V1LiquidityTokens.filter(V1LiquidityToken => {
    const balance = V1LiquidityBalances?.[V1LiquidityToken.address]
    return balance && JSBI.greaterThan(balance.raw, JSBI.BigInt(0))
  }).map(V1LiquidityToken => {
    const balance = V1LiquidityBalances[V1LiquidityToken.address]
    return balance ? (
      <V1PositionCard
        key={V1LiquidityToken.address}
        token={V1Exchanges[V1LiquidityToken.address]}
        V1LiquidityBalance={balance}
      />
    ) : null
  })

  // should never always be false, because a V1 exhchange exists for WETH on all testnets
  const isLoading = Object.keys(V1Exchanges)?.length === 0 || V1LiquidityBalancesLoading
  const [clicked,setClicked] = useState(false)
  const [clickedtwo,setClickedtwo] = useState(false)


  return (
    <BodyWrapper style={{ padding: 24 }}>
      <AutoColumn gap="16px">
        <AutoRow style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TYPE.mediumHeader>Migrate Your Liquidity</TYPE.mediumHeader>

        </AutoRow>

        {!account ? (
          <LightCard padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
              Connect to a wallet.
            </TYPE.body>
          </LightCard>
        ) : isLoading ? (
          <LightCard padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
              <Dots>Loading</Dots>
            </TYPE.body>
          </LightCard>
        ) : (
          <>
            <AutoRow style={{display: !clickedtwo ? "grid" : "flex", gap: 10, justifyContent: "center", flexDirection: !clickedtwo ? "column" : "column-reverse"}} >
                
            {!clickedtwo ? (
             <Option
            active={false}
            onClick={()=>setClicked(!clicked)}
            >
            <TYPE.subHeader>Non-hardware Wallet</TYPE.subHeader>
            {clicked === true ? (
                <p><X size="18" style={{ marginBottom: '-3px' }} /></p>

            ) : <p><ChevronDown size="18" style={{ marginBottom: '-3px' }} /></p>}
            
             </Option>) : <EmptyState message="No Liquidity found." />}
            

            {!clicked ? (
           
            <Option
            active={false}
            onClick={()=>setClickedtwo(!clickedtwo)}
            >
            <TYPE.subHeader>Hardware Wallet</TYPE.subHeader>
            {clickedtwo ? (
                <p><X size="18" style={{ marginBottom: '-3px' }} /></p>

            ) : <p><ChevronDown size="18" style={{ marginBottom: '-3px' }} /></p>}
            
             </Option>) : <EmptyState message="No Liquidity found." />
             }

            </AutoRow>
            {allV1PairsWithLiquidity?.length > 0 ? (
              <>{allV1PairsWithLiquidity}</>
            ) : (
              null
            )}
          </>
        )}
      </AutoColumn>
    </BodyWrapper>
  )
}

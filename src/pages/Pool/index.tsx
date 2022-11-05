import React, { useContext, useMemo, useState } from 'react'
import styled, { keyframes, ThemeContext } from 'styled-components'
import { Pair, JSBI } from '@spherium/swap-sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import Settings from '../../components/Settings'

import { StyledInternalLink, ExternalLink, TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'

import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard } from '../../components/earn/styled'
import { REWARDS_DURATION_DAYS, useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import Liquidity from '../../assets/images/2_white.svg'
import PairImg from '../../assets/images/1_white.svg'
import { isBSC } from 'utils/checkBSC'
import CreatePool from '../AddLiquidity'
import PairNotFound from '../../assets/images/pairNotfound.png'
import Account from '../../components/Account'
import { Link as Redirect } from 'react-router-dom'

import LiquidityPool from '../../components/liquidityPool'

const TopSection = styled(AutoColumn)`
  //max-width: 1170px;
  display: flex;
  gap: 20px;
  width: 100%;
  //margin-bottom: 20px;
  //padding-right: 5%;
  //padding-left: 5%

//   ${({ theme }) => theme.mediaWidth.upToNormal`
//   display: inline-flex;
//   width: 100%;
  
// `};

  ${({ theme }) => theme.mediaWidth.upToNormal`
  display: block;

`};
`

const VoteCard = styled(DataCard)`
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  height: 100%;
  background-color: #212a3b;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

    height: 100%;
    width:100%;
   // margin-bottom: 20px;

  `};
  ${({ theme }) => theme.mediaWidth.upToNormal`
  width:100%;
  height: 100%;
  max-width: 100%;



`};
  //   ${({ theme }) => theme.mediaWidth.upToNormal`
  // //  margin-bottom: 20px;
  //   display: grid;
  //   width:100%;
  //   max-width: 100%;
  //   height: 100%;


  // `};

 
`

const TitleRow = styled(RowBetween)`
  width: 100%;
  justify-content: space-between;
`

// const ButtonRow = styled.div`
//   gap: 30px;
//   width: 100%;
//   display: flex;
//   justify-content: flex-end;
//   ${({ theme }) => theme.mediaWidth.upToSmall`

//     //flex-direction: row-reverse;
//     justify-content: flex-end !important;
//   `};
// `

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: 500px;
  background-color: #5b94ed;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        height: 300px;
        width: 100%;
        margin-top: 20px;

        
      `};
  ${({ theme }) => theme.mediaWidth.upToNormal`
   display: grid;
   width: 100%;
   height: 300px;
   margin-top: 20px;
 
 `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: 500px;
  background-color: #87f2e7;
  border: #87f2e7;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

        height: 300px;
        width:100%;
        margin-bottom: 20px;

      `};

  ${({ theme }) => theme.mediaWidth.upToNormal`
        display: grid;
        height: 300px;
        width: 100%;
        margin-bottom: 20px;

      
      `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const pulse = keyframes`
  0% {
    transform: translateY(10px);

  }
  20% {
    
    transform: translateY(0px);
  }
  85% {
    
    transform: translateY(0px);
  }
  100% {
  
    transform: translateY(10px);
  }

`
const LiqWrapper = styled.div`
  position: absolute;
  top: 18px;
  width: 120px;
  height: 120px;
  animation: ${pulse} 2s infinite;
`

const rotate = keyframes`
  0% {
    transform: rotate(180deg);

  }

  100% {
  
    transform: rotate(-180deg);
  }

`
const PairWrapper = styled.div`
  position: absolute;
  width: 130px;
  height: 130px;
  animation: ${rotate} 2s infinite;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1170px;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow-y: hidden;
  .liquidity {
    width: 50%;
    padding: 10px 15px;
    border: 1px solid gray;

    .liquidity-proivder-reward {
      color: #2a324a;
      width: 100%;
      background-image: linear-gradient(to right bottom, #dbddff 95%, #a4ffe9 5%);
      background: linear-gradient(114.61deg, #dbddff 32.4%, rgba(164, 255, 233, 0) 150.98%);
      border-radius: 8px;
      padding: 10px 15px;
      margin-top: 20px;
    }

    .add-liquidity {
      color: #2a324a;
    }
    .your-liquidity {
      color: #2a324a;
    }
    .create-pool {
      color: #2a324a;
    }
  }
  .pair-list {
    width: 50%;
  }
`
const PageWrapper = styled.div`
  /* remove it once you are done */
  /* position: relative;
  z-index: 100; */
  max-width: 1170px;
  width: 100%;
  height: 100%;
`

const LiquidityMenu = styled.ul`
  background-color: #d0d8f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px;
  border-radius: 8px;
  color: #2a324a;
`
const MenuItem = styled.li<{ isActive: boolean }>`
  width: 50%;
  list-style: none;
  padding: 17px 0px;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  border-right: 1px solid #a7b1d2;
  margin-right: 4px;
  cursor: pointer;
  background-color: ${props => (props.isActive ? 'rgba(255, 255, 255, 0.44)' : '#d0d8f4')};
  color: ${props => (props.isActive ? '#2e37f2;' : '#2a324a')};

  &:last-child {
    margin-right: 0px;
  }
`

const UpperSection = styled.div`
  align-items: center;
  width: 100%;
  justify-content: space-between;
  display: flex;
  padding-left: 10px;
  height: 84px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

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
`

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  display: grid;
  overflow: visible;


`};
`
const ApBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  //padding-top: 33px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    //padding: 2rem;
    display: grid;
    width: 100%;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem;
    display: grid;
  `};
`
const AppWrapper = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: none;
  height: 100%;
  max-width: 40%;
  justify-content: end;
  display: inline-flex;
  flex-direction: column;
  flex-flow: column;
  align-items: center;
  overflow-x: hidden;
  //padding: 0px 50px 0px 50px;

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px;
    display: block;

  `};
`
const GraphDiv = styled.div`
  display: flow-root;
  width: 100%;
  height: 100%;
  position: relative;
  max-width: 60%;
  background: radial-gradient(940px 909px at center, rgba(52, 56, 91, 0.1), transparent, transparent);

  ${({ theme }) => theme.mediaWidth.upToNormal`
  max-width: 100%;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-bottom: 170px;
  `};

`

const MENU_ITEMS = [
  {
    text: 'Create Pool',
    windowId: 1
  },
  {
    text: 'Add Liquidity',
    windowId: 2
  }
]

const WINDOWS_ID = {
  liquidityProiderReward: 0,
  createPool: 1,
  addLiquidity: 2
}

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const [currentWindow, setCurrentWindow] = useState(WINDOWS_ID.liquidityProiderReward)
  return <div> not found </div>
}

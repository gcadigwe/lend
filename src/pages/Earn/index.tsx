import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@spherium/swap-sdk'
import { BIG_INT_ZERO } from '../../constants'
//import { OutlineCard } from '../../components/Card'

const PageWrapper = styled(AutoColumn)`
  max-width: 1075px;
  width: 100%;
  margin: 2rem;
  //padding: 0px 100px 0px 100px;
`

const TopSection = styled(AutoColumn)`
  max-width: 1075px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: auto;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

export default function Earn() {
  const { chainId } = useActiveWeb3React()

  // staking info for connected account
  const stakingInfos = useStakingInfo()

  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  const stakingInfosWithBalance = stakingInfos?.filter(s => JSBI.greaterThan(s.stakedAmount.raw, BIG_INT_ZERO))

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600} fontSize={18} marginBottom={15}>
                  Liquidity provider rewards
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={16} fontWeight={250}>
                  {`Liquidity providers earn a 0.27% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
                </TYPE.white>
              </RowBetween>
              <ExternalLink
                style={{ visibility: 'hidden', color: 'white', textDecoration: 'underline'}}
                target="_blank"
                href="#"
              >
                <TYPE.white style={{visibility: 'hidden'}} fontSize={14} marginTop={15}>Read more about providing liquidity</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', zIndex: 10001, display: 'block' }}>
        <DataRow style={{ alignItems: 'baseline', justifyContent: 'space-between', marginTop: '2rem' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem', color: '#f3ba2f' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
        </DataRow>

        <PoolSection style={{ justifyContent: 'center' }}>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <RowBetween style={{ justifyContent: 'center' }}>No active pools</RowBetween>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <RowBetween style={{ justifyContent: 'center' }}>No active pools</RowBetween>
          ) : (
            stakingInfosWithBalance?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

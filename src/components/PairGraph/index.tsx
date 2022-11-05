import React, { useEffect, useRef, useState } from 'react'
import { formattedNum, getPairChartData, hourlyRatedData, toK, toNiceDate, toNiceDateYear } from './getGraphData'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Bar, BarChart } from 'recharts'
import { darken } from 'polished'
import Loader from '../Loader'
import { OptionButton } from '../ButtonStyled'
//import { useMedia } from 'react-use'
import { AutoRow } from 'components/Row'
import DropdownSelect from '../DropdownSelect'
import { timeframeOptions } from '../../constants'
import CandleStickChart from '../CandleChart'
import { healthClient } from 'apollo/client'
import { SUBGRAPH_HEALTH } from 'apollo/queries'
import { formatedGraphData, getTimeframe } from 'utils'
import { AutoColumn } from '../../components/Column'
import { Text } from 'rebass'
import { client, blockClient, ETHClient, ETHBLocksClient, BNBClient, BNBBlocksClient } from '../../apollo/client'
import { useActiveWeb3React } from 'hooks'

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  RATE0: 'Rate 0',
  RATE1: 'Rate 1'
}

const addresses = [
  '0x9928e4046d7c6513326ccea028cd3e7a91c7590a',
  '0x94b0a3d511b6ecdb17ebf877278ab030acb0a878',
  '0x21b8065d10f73ee2e260e5b47d3344d3ced7596e',
  '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
  '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
  '0xbb2b8038a1640196fbe3e38816f3e67cba72d940'
]

export const GraphWrapper = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;

  //margin-bottom: 20px;
  //margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  //border-radius: 8px;
  padding: 20px;
  z-index: 11;

  .recharts-surface {
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    // height: 400px !important;
  }

  .recharts-wrapper {
    width: 100% !important;
    height: 400px !important;
  }

  .tv-lightweight-charts {
    width: 100% !important;
  }

  table {
    width: 100% !important;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //background-color: white;
`};
`

const OptionsRow = styled.div`
  display: block;
  flex-direction: row;
  width: 100%;
  // margin-top: 40px;
`
const BottomSection = styled.div`
  display: flex;
  width: 100%
  gap: 20px;
  height: 100%;
  align-items: center;
  justify-content: center;  
  padding-top: 50px;
`
const TotalLiq = styled.div`
  background-color: #defcfa;
  border-radius: 10px;
  display: grid;
  max-width: 305px;
  width: 100%;
  color: black;
  height: 140px;
  font-size: 22px;
  padding: 20px;
`

const ValueLocked = styled.div`
  background-color: #dcecff;
  border-radius: 10px;
  display: grid;
  max-width: 305px;
  width: 100%;
  color: black;
  height: 140px;
  font-size: 22px;
  padding: 20px;
`

const Rates = styled.div`
  display: flex;
  width: 62px;
  font-size: 13px;
  color: white;
  border-radius: 20px;
  background-color: #69c5a3;
  align-items: center;
  justify-content: center;
`

interface PairGraphProps {
  tokenAName: string
  tokenBName: string
  pairData: any
  pairAddress: string
}

export default function PairGraph({ tokenAName, tokenBName, pairAddress, pairData }: PairGraphProps) {
  const { account, chainId } = useActiveWeb3React()
  // eslint-disable-next-line prefer-const
  let [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [chartFilter, setChartFilter] = useState<string>(CHART_VIEW.LIQUIDITY)
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  const [currentSlice, setCurrentSlice] = useState(chartData)
  const [blocks, setBlocks] = useState({
    CURRENCY: 'USD',
    TIME_KEY: 'All time',
    LATEST_BLOCK: null,
    HEAD_BLOCK: null,
    SESSION_START: null
  })

  const color = '#ffff'
  // const below1600 = useMedia('(max-width: 1600px)')
  // const below1080 = useMedia('(max-width: 1080px)')
  // const below600 = useMedia('(max-width: 600px)')
  // const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  const ref = useRef<any>(null)
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)
  const [hourlyData, setHourlyData] = useState([])
  const [hourlyDataLoading, setHoulryDataLoading] = useState(false)
  const hourlyRate0 = hourlyData && hourlyData[0]
  const hourlyRate1 = hourlyData && hourlyData[1]

  const getCurrentClient = () => {
    if (chainId == 1) return [ETHClient, ETHBLocksClient]
    if (chainId == 56) return [BNBClient, BNBBlocksClient]

    return [client, blockClient]
  }
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      // const result = await getPairChartData(addresses[Math.floor(Math.random() * 6) + 1])
      const result = await getPairChartData(pairAddress)
      setLoading(false)
      setChartData(result)
      setCurrentSlice(result)
    }
    fetch()
  }, [pairAddress])

  useEffect(() => {
    const utcStartTime = getTimeframe(timeWindow)
    const filteredData = chartData.filter((entry: any) => entry.date >= utcStartTime)
    setCurrentSlice(filteredData)
  }, [timeWindow])

  useEffect(() => {
    async function fetch() {
      healthClient
        .query({
          query: SUBGRAPH_HEALTH
        })
        .then((res: any) => {
          const syncedBlock = res.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number
          const headBlock = res.data.indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number
          if (syncedBlock && headBlock) {
            setBlocks({ ...blocks, LATEST_BLOCK: syncedBlock, HEAD_BLOCK: headBlock })
          }
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
    if (!blocks.LATEST_BLOCK) {
      fetch()
    }
  }, [blocks])

  useEffect(() => {
    async function fetch() {
      setHoulryDataLoading(true)
      const data = await hourlyRatedData(timeWindow, tokenAName, tokenBName, blocks.LATEST_BLOCK, getCurrentClient())
      // const data = await hourlyRatedData(timeWindow, pairAddress, blocks.LATEST_BLOCK)
      setHoulryDataLoading(false)
      setHourlyData(data as any)
    }
    fetch()
  }, [timeWindow, pairAddress])
  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val: any) {
    if (chartFilter === CHART_VIEW.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${pairData.tokenATicker}/${pairData.tokenBTicker}<span>`
      )
    }
    if (chartFilter === CHART_VIEW.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${pairData.tokenATicker}/${pairData.tokenBTicker}<span>`
      )
    }
    return null
  }

  if (chartData && chartData.length === 0) {
    return (
      <GraphWrapper height={300}>
        <h1>No historical data yet.</h1>
      </GraphWrapper>
    )
  }
  if (loading) {
    return (
      <GraphWrapper height={300}>
        <Loader />
      </GraphWrapper>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flow-root', marginRight: 32 }}>
      <GraphWrapper height={531}>
        {/* {below600 ? ( */}
        {/* <RowBetween mb={40}>
          <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
        </RowBetween>
      ) : ( */}
        <OptionsRow style={{ flexWrap: 'nowrap', display: 'flex', marginBottom: 10 }}>
          <AutoRow gap="6px" style={{ flexWrap: 'nowrap'}}>
            <OptionButton
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(CHART_VIEW.LIQUIDITY)
              }}
            >
              Liquidity
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.VOLUME}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(CHART_VIEW.VOLUME)
              }}
            >
              Volume
            </OptionButton>
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              // style={{ color: 'white', backgroundColor: '#2A324A' }}
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </OptionButton>
          </AutoRow>
        </OptionsRow>
        {/* )} */}
        {chartFilter === CHART_VIEW.LIQUIDITY && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={currentSlice}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={'rgba(103, 200, 171, 0.54)'} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={'rgba(103, 200, 171, 0.54)'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                tickLine={false}
                axisLine={false}
                interval="preserveEnd"
                tickMargin={14}
                minTickGap={80}
                tickFormatter={tick => toNiceDate(tick)}
                dataKey="date"
                tick={{ fill: '#fff' }}
                type={'number'}
                domain={['dataMin', 'dataMax']}
              />
              <YAxis
                type="number"
                orientation="right"
                tickFormatter={tick => '$' + toK(tick)}
                axisLine={false}
                tickLine={false}
                interval="preserveEnd"
                minTickGap={80}
                yAxisId={0}
                tickMargin={16}
                tick={{ fill: '#fff' }}
              />
              <Tooltip
                cursor={true}
                formatter={(val: any) => formattedNum(val, true)}
                labelFormatter={label => toNiceDateYear(label)}
                labelStyle={{ paddingTop: 4 }}
                contentStyle={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  borderColor: '#fff',
                  color: 'black'
                }}
                wrapperStyle={{ top: -70, left: -10 }}
              />
              <Area
                strokeWidth={2}
                dot={false}
                type="monotone"
                name={' (USD)'}
                dataKey={'reserveUSD'}
                yAxisId={0}
                stroke={darken(0.12, 'rgba(103, 200, 171, 0.54)')}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {chartFilter === CHART_VIEW.VOLUME && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              margin={{ top: 0, right: 0, bottom: 6, left: 10 }}
              // margin={{ top: 0, right: 0, bottom: 6, left: below1080 ? 0 : 10 }}
              barCategoryGap={1}
              data={currentSlice}
            >
              <XAxis
                tickLine={false}
                axisLine={false}
                interval="preserveEnd"
                minTickGap={80}
                tickMargin={14}
                tickFormatter={(tick: any) => toNiceDate(tick)}
                dataKey="date"
                tick={{ fill: '#fff' }}
                type={'number'}
                domain={['dataMin', 'dataMax']}
              />
              <YAxis
                type="number"
                axisLine={false}
                tickMargin={16}
                tickFormatter={(tick: any) => '$' + toK(tick)}
                tickLine={false}
                interval="preserveEnd"
                orientation="right"
                minTickGap={80}
                yAxisId={0}
                tick={{ fill: '#fff' }}
              />
              <Tooltip
                cursor={{ fill: color, opacity: 0.1 }}
                formatter={(val: any) => formattedNum(val, true)}
                labelFormatter={(label: string) => toNiceDateYear(label)}
                labelStyle={{ paddingTop: 4 }}
                contentStyle={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  borderColor: color,
                  color: '#000'
                }}
                wrapperStyle={{ top: -70, left: -10 }}
              />
              <Bar
                type="monotone"
                name={'Volume'}
                dataKey={'dailyVolumeUSD'}
                fill={'rgba(103, 200, 171, 0.54)'}
                opacity={'0.4'}
                yAxisId={0}
                stroke={'rgba(103, 200, 171, 0.54)'}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        {chartFilter === CHART_VIEW.RATE1 &&
          (hourlyRate1 && !hourlyDataLoading ? (
            <ResponsiveContainer width="100%" height="100%" ref={ref}>
              <CandleStickChart
                data={formatedGraphData(hourlyRate1)}
                base={100 / 50}
                margin={false}
                width={width}
                valueFormatter={valueFormatter}
              />
            </ResponsiveContainer>
          ) : (
            <GraphWrapper height={100}>
              <Loader />
            </GraphWrapper>
          ))}

        {chartFilter === CHART_VIEW.RATE0 &&
          (hourlyRate0 && !hourlyDataLoading ? (
            <ResponsiveContainer width="100%" height="100%" ref={ref}>
              <CandleStickChart
                data={formatedGraphData(hourlyRate0)}
                base={100 / 50}
                margin={false}
                width={width}
                valueFormatter={valueFormatter}
              />
            </ResponsiveContainer>
          ) : (
            <GraphWrapper height={100}>
              <Loader />
            </GraphWrapper>
          ))}
      </GraphWrapper>
    </div>
  )
}

PairGraph.defaultProps = {
  pairAddress: '0x000000000000'
}

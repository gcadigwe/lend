import { client } from 'apollo/client'
import { getAllPairs, HOURLY_PAIR_RATES, PAIR_CHART } from 'apollo/queries'
import { timeframeOptions } from '../../constants'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Numeral from 'numeral'
import { getBlocksFromTimestamps, splitQuery } from 'utils'

dayjs.extend(utc)

export const toNiceDate = (date: any) => {
  const x = dayjs.utc(dayjs.unix(date)).format('MMM DD')
  return x
}

export const toK = (num: any) => {
  return Numeral(num).format('0.[00]a')
}
// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: any, digits: any) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
  return formatter.format(num)
}

export const formattedNum = (number: any, usd = false, acceptNegatives = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  const num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0))
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd ? formatDollarAmount(num, 0) : Number(parseFloat(String(num)).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarAmount(num, 4)
    } else {
      return formatDollarAmount(num, 2)
    }
  }

  return Number(parseFloat(String(num)).toFixed(4)).toString()
}

export const toNiceDateYear = (date: any) => dayjs.utc(dayjs.unix(date)).format('MMMM DD, YYYY')

export const getPairChartData = async (pairAddress: string) => {
  let data: any = []
  const utcEndTime = dayjs.utc()
  const utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
  const startTime = utcStartTime.unix() - 1

  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      const result = await client.query({
        query: PAIR_CHART,
        variables: {
          pairAddress: pairAddress,
          skip
        }
        // fetchPolicy: 'cache-first'
      })
      skip += 1000
      data = data.concat(result.data.pairDayDatas)
      if (result.data.pairDayDatas.length < 1000) {
        allFound = true
      }
    }

    const dayIndexSet = new Set()
    const dayIndexArray: any = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData: any, i: number) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
      dayData.reserveUSD = parseFloat(dayData.reserveUSD)
    })

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime
      let latestLiquidityUSD = data[0].reserveUSD
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        const currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolumeUSD: 0,
            reserveUSD: latestLiquidityUSD
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveUSD
          index = index + 1
        }
        timestamp = nextDay
      }
    }

    data = data.sort((a: any, b: any) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }

  return data
}

const getHourlyRateData = async (pairAddress: string, startTime: any, latestBlock: any, currentClient: any) => {
  try {
    const utcEndTime = dayjs.utc()
    let time = startTime

    // create an array of hour start times until we reach current hour
    const timestamps = []
    while (time <= utcEndTime.unix() - 3600) {
      timestamps.push(time)
      time += 3600
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return []
    }

    // once you have all the timestamps, get the blocks for each timestamp in a bulk query
    let blocks
    blocks = await getBlocksFromTimestamps(timestamps, currentClient[1], 100)
    // catch failing case
    if (!blocks || blocks?.length === 0) {
      return []
    }
    if (latestBlock) {
      blocks = blocks.filter((b: any) => {
        return parseFloat(b.number) <= parseFloat(latestBlock)
      })
    }
    const result: any = await splitQuery(HOURLY_PAIR_RATES, currentClient[0], [pairAddress], blocks, 100)
    // format token ETH price results
    const values = []
    for (const row in result) {
      const timestamp = row.split('t')[1]
      if (timestamp) {
        const token0Price = result[row]?.token0Price
        const token1Price = result[row]?.token1Price
        values.push({
          timestamp,
          rate0: token0Price ? parseFloat(token0Price) : 0,
          rate1: token1Price ? parseFloat(token1Price) : 0
        })
      }
    }
    const formattedHistoryRate0 = []
    const formattedHistoryRate1 = []
    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistoryRate0.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate0 as any),
        close: parseFloat(values[i + 1].rate0 as any)
      })
      formattedHistoryRate1.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate1 as any),
        close: parseFloat(values[i + 1].rate1 as any)
      })
    }
    return [formattedHistoryRate0, formattedHistoryRate1]
  } catch (e) {
    console.log('Hourly rated data error', e)
    return [[], []]
  }
}

const getAllPairsOnHyperSwap = async (client: any) => {
  try {
    const res = await client.query({
      query: getAllPairs
    })
    if (res.data) {
      return res.data.pairs
    }
  } catch (error) {
    return []
  }
}

type singlePair = {
  id: string
  token0: {
    symbol: string
  }

  token1: {
    symbol: string
  }
}

const getRightAddressesByNamy = async (token0Symbol: string, token1Symbol: string, client: any) => {
  const allPairs: singlePair[] = await getAllPairsOnHyperSwap(client)
  for (const pair of allPairs) {
    if (pair.token0.symbol === token0Symbol && pair.token1.symbol === token1Symbol) {
      return pair.id
    }
  }
  return null
}

export const hourlyRatedData = async (
  timeWindow: any,
  token1Name: string,
  token2Name: string,
  latestBlock: any,
  currentClient: any
) => {
  const currentTime = dayjs.utc()
  const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
  const startTime =
    timeWindow === timeframeOptions.ALL_TIME
      ? 1589760000
      : currentTime
          .subtract(1, windowSize)
          .startOf('hour')
          .unix()
  const rightAddress = await getRightAddressesByNamy(token1Name, token2Name, currentClient[0])
  if (!rightAddress) return [[], []]
  const data = await getHourlyRateData(rightAddress, startTime, latestBlock, currentClient)
  return data
}

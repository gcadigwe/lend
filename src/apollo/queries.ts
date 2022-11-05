import gql from 'graphql-tag'

export const PAIR_CHART = gql`
  query pairDayDatas($pairAddress: Bytes!, $skip: Int!) {
    pairDayDatas(first: 1000, skip: $skip, orderBy: date, orderDirection: asc, where: { pairAddress: $pairAddress }) {
      id
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      reserveUSD
    }
  }
`

export const SUBGRAPH_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "uniswap/uniswap-v2") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`

export const HOURLY_PAIR_RATES = (pairAddress: string, blocks: any) => {
  let queryString = 'query blocks {'
  // blocks.push({
  //   timestamp: '1620931634',
  //   number: 10809406
  // })
  queryString += blocks.map(
    (block: any) => `
      t${block.timestamp}: pair(id: "${pairAddress}", block: { number: ${block.number} }) {
        token0Price
        token1Price
      }
    `
  )

  // queryString += `
  // t1620931634: pair(id: "0xd890ac6ae54e48f5ad5dc026a5e4d45759eeff67", block: { number: 10809406 }){
  //   token0Price
  //   token1Price
  // }
  // `

  queryString += '}'
  return gql(queryString)
}

export const GET_BLOCKS = (timestamps: any) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp: any) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp +
      600} }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const getAllPairs = gql`
  query {
    pairs {
      id
      token0 {
        symbol
      }

      token1 {
        symbol
      }
    }
  }
`

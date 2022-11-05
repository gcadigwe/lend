import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/spheriumfinance/hyperswap-ropsten'
    // uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
  }),
  cache: new InMemoryCache()
})

export const ETHClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/spheriumfinance/hyperswap-ropsten'
    // uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
  }),
  cache: new InMemoryCache()
})

export const BNBClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/spheriumfinance/hyperswap-ropsten'
    // uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
  }),
  cache: new InMemoryCache()
})

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/index-node/graphql'
  }),
  cache: new InMemoryCache(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //@ts-ignore
  shouldBatch: true
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    uri: 'https://api.thegraph.com/subgraphs/name/humaohua/ethereumblocks'
  }),
  cache: new InMemoryCache()
})

export const ETHBLocksClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    uri: 'https://api.thegraph.com/subgraphs/name/humaohua/ethereumblocks'
  }),
  cache: new InMemoryCache()
})

export const BNBBlocksClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    uri: 'https://api.thegraph.com/subgraphs/name/humaohua/ethereumblocks'
  }),
  cache: new InMemoryCache()
})

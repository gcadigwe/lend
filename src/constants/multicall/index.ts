import { ChainId } from '@spherium/swap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x338A48b83b9f1E564338B4903615f5ece8796beb',//Spherium multicall address
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x4F6203b34a85D1647303A5888bD744120922135f',//Spherium multicall address
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.BSC_MAINNET]: '0xfab448Caa772977Fcca9654D343B910Ef616F5d6',
  [ChainId.BSC_TESTNET]: '0x338A48b83b9f1E564338B4903615f5ece8796beb',//Spherium multicall address
  [ChainId.MUMBAI]: '',
  [ChainId.MATIC]: '',//TODO POLY
  [ChainId.FUJI]: '',
  [ChainId.AVALANCHE]: '', //TODO AVAX
  [ChainId.ARBITRUM_MAINNET]: '', //TODO Arb
  [ChainId.ARBITRUM_TESTNET]: '', //TODO arb





}

export { MULTICALL_ABI, MULTICALL_NETWORKS }

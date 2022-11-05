import { BigNumber, ethers, utils } from 'ethers'
import {
  BridgeConfig,
  TokenConfig,
  crosschainConfig,
  crosschainConfigAvaxPoly,
  crosschainConfigEthBnb
} from '../../constants/CrosschainConfig'
import {
  ChainTransferState,
  CrosschainChain,
  CrosschainToken,
  ProposalStatus,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainDepositConfirmed,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapDetails,
  setCrosschainTransferStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID,
  setPendingTransfer,
  setTargetChain,
  setTargetTokens,
  setTransferAmount,
  setErrorMsg,
  setFeeTxHash,
  setOriginalChain,
  setTVL,
  setTokenAmount,
  setTokenAmountLocked,
  setBridgeTVL
} from './actions'
import store, { AppDispatch, AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { ChainId } from '@spherium/swap-sdk'
import Web3 from 'web3'
import { initialState } from './reducer'
import { useActiveWeb3React } from '../../hooks'
import { useEffect } from 'react'
import useGasPrice from 'hooks/useGasPrice'
import web3 from 'web3'
import chunkArray from 'utils/chunkArray'
import { tokensMap } from './tokensMap'
// import { afterWrite } from '@popperjs/core'

const BridgeABI = require('../../constants/abis/Bridge.json')
const TokenABI = require('../../constants/abis/ERC20PresetMinterPauser.json').abi

//add 2 new files

// eslint-disable-next-line @typescript-eslint/no-var-requires
const USDTTokenABI = require('../../constants/abis/USDTABI.json').abi

let dispatch: AppDispatch
let web3React: any

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

export function getCrosschainState(): AppState['crosschain'] {
  return store.getState().crosschain || initialState
}

function WithDecimals(value: string | number): string {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return utils.formatUnits(value, 18)
}

function WithDecimals6(value: string | number): string {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return utils.formatUnits(value, 6)
}

function WithDecimalsHexString(value: string, decimals: number): string {
  return BigNumber.from(utils.parseUnits(value, decimals)).toHexString()
}

function GetCurrentChain(currentChainName: string): CrosschainChain {
  let result: CrosschainChain = {
    name: '',
    chainID: ''
  }

  for (const chain of crosschainConfig.chains) {
    if (chain.name === currentChainName) {
      result = {
        name: chain.name,
        chainID: String(chain.chainId),
        symbol: chain.nativeTokenSymbol
      }
    }
  }
  return result
}

function GetChainbridgeConfigByID(chainID: number | string): BridgeConfig {
  if (typeof chainID === 'string') {
    chainID = Number(chainID)
  }
  let result: BridgeConfig = {
    chainId: -1,
    networkId: -1,
    name: '',
    bridgeAddress: '',
    erc20HandlerAddress: '',
    rpcUrl: '',
    tokens: [],
    nativeTokenSymbol: '',
    type: 'Ethereum'
  }
  for (const chain of crosschainConfig.chains) {
    if (chain.chainId === chainID) {
      result = chain
    }
  }
  return result
}

export function GetTokenByAddress(address: string): TokenConfig {
  let result: TokenConfig = {
    address: '',
    decimals: 18,
    resourceId: '',
    assetBase: ''
  }
  for (const chain of crosschainConfig.chains) {
    for (const token of chain.tokens) {
      if (token.address === address) {
        result = token
        return result
      }
    }
  }
  return result
}

function GetAvailableChains(currentChainName: string): Array<CrosschainChain> {
  const result: Array<CrosschainChain> = []
  for (const chain of crosschainConfig.chains) {
    if (chain.name !== currentChainName) {
      result.push({
        name: chain.name,
        chainID: String(chain.chainId)
      })
    }
  }
  return result
}

function GetAvailableTokens(chainName: string): Array<CrosschainToken> {
  const result: Array<CrosschainToken> = []
  for (const chain of crosschainConfig.chains) {
    if (chain.name === chainName) {
      for (const token of chain.tokens) {
        const t = {
          chainId: chain.chainId,
          address: token.address,
          name: token.name || '',
          symbol: token.symbol || '',
          decimals: token.decimals,
          imageUri: token.imageUri,
          resourceId: token.resourceId,
          isNativeWrappedToken: token.isNativeWrappedToken,
          assetBase: token.assetBase
        }
        result.push(t)
      }
    }
  }
  return result
}

function GetChainNameById(chainID: number): string {
  if (chainID === ChainId.MAINNET) {
    return 'Ethereum'
  } else if (chainID === ChainId.RINKEBY) {
    return 'Rinkeby'
  } else if (chainID === ChainId.ROPSTEN) {
    return 'Ropsten'
  } else if (chainID === ChainId.BSC_MAINNET) {
    return 'Binance Smart Chain'
  } else if (chainID === ChainId.BSC_TESTNET) {
    return 'Smart Chain Test'
  } else if (chainID === ChainId.AVALANCHE) {
    return 'Avalanche'
  } else if (chainID === ChainId.FUJI) {
    return 'Fuji'
  } else if (chainID === ChainId.MATIC) {
    return 'Polygon'
  } else if (chainID === ChainId.MUMBAI) {
    return 'Mumbai'
  } else if (chainID === ChainId.ARBITRUM_MAINNET) {
    return 'Arbitrum'
  }
  return ''
}

export const BreakCrosschainSwap = () => {
  dispatch(
    setCurrentTxID({
      txID: ''
    })
  )
  dispatch(
    setCrosschainTransferStatus({
      status: ChainTransferState.TransferFee
    })
  )

  dispatch(
    setCrosschainSwapDetails({
      details: {
        status: ProposalStatus.INACTIVE,
        voteCount: 0
      }
    })
  )

  dispatch(
    setCrosschainDepositConfirmed({
      confirmed: false
    })
  )

  dispatch(
    setPendingTransfer({
      pendingTransfer: {}
    })
  )
}

export function useCrosschainHooks() {
  dispatch = useDispatch()
  web3React = useActiveWeb3React()

  const getNonce = async (): Promise<number> => {
    return await web3React.library.getSigner().getTransactionCount()
  }
  const { feeTxHash, crosschainFee, origin, targetChain } = useCrosschainState()

  const MakeDeposit = async () => {
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.TransferPending
      })
    )

    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    const targetChain = GetChainbridgeConfigByID(chainId === 1 ? 56 : chainId === 56 ? 1 : 1)
    const destinationChain = getDestinationChain()

    // const currentGasPrice = await useGasPrice()
    dispatch(
      setCurrentTxID({
        txID: ''
      })
    )
    const signer = web3React.library.getSigner()
    const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

    const resultDepositTx = await bridgeContract
      .deposit(
        web3.utils.toWei(crosschainState.transferAmount, 'ether'),
        feeTxHash,
        currentToken.address,
        crosschainState.targetChain?.chainID === '56' ? 'BNB' : destinationChain
      )

      .catch((err: any) => {
        dispatch(
          setErrorMsg({
            value: err?.message?.toString()
          })
        )

        dispatch(
          setCrosschainTransferStatus({
            status: ChainTransferState.TransferFailed
          })
        )

        dispatch(
          setErrorMsg({
            value: err?.message?.toString()
          })
        )
      })

    console.log('Transfer Amount is said to be : ' + crosschainState.transferAmount)
    if (!resultDepositTx) {
      return
    }

    await resultDepositTx.wait().catch((err: any) => {
      dispatch(
        setCrosschainTransferStatus({
          status: ChainTransferState.TransferFailed
        })
      )

      dispatch(
        setErrorMsg({
          value: err?.message?.toString()
        })
      )
    })

    const web3CurrentChain = new Web3(currentChain.rpcUrl)
    const receipt = await web3CurrentChain.eth.getTransactionReceipt(resultDepositTx.hash)

    const nonce = receipt.logs[receipt.logs.length - 1].topics[3]

    dispatch(
      setCurrentTxID({
        txID: resultDepositTx.hash
      })
    )
    if (origin === undefined) {
      dispatch(
        setOriginalChain({
          chain: targetChain.chainId
        })
      )
    }

    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.TransferComplete
      })
    )

    const state = getCrosschainState()
    const pendingTransfer = {
      currentSymbol: state?.currentToken?.symbol,
      targetSymbol: state?.targetTokens?.find((x: { assetBase: any }) => x.assetBase === state?.currentToken?.assetBase)
        ?.symbol,
      assetBase: state?.currentToken?.assetBase,
      amount: state?.transferAmount,
      decimals: state?.currentToken?.decimals,
      name: state?.targetChain?.name,
      address: state?.currentToken?.address,
      status: state?.swapDetails?.status,
      votes: state?.swapDetails?.voteCount
    }

    dispatch(
      setPendingTransfer({
        pendingTransfer
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    // UpdateOwnTokenBalance().catch(console.error)

    while (true) {
      try {
        await delay(5000)
        const web3TargetChain = new Web3(targetChain.rpcUrl)
        const destinationBridge = new web3TargetChain.eth.Contract(BridgeABI, targetChain.bridgeAddress)
        const proposal = await destinationBridge.methods
        // .getProposal(
        //   currentChain.chainId,
        //   nonce,
        //   web3TargetChain.utils.keccak256(targetChain.erc20HandlerAddress + data.slice(2))
        // )
        //   .call()
        //   .catch()
        // dispatch(
        //   setCrosschainSwapDetails({
        //     details: {
        //       status: proposal._status,
        //       voteCount: !!proposal?._yesVotes ? proposal._yesVotes.length : 0
        //     }
        //   })
        // )

        if (proposal && proposal._status === ProposalStatus.EXECUTED) {
          await delay(5000)
          BreakCrosschainSwap()
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const GetAllowance = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
    const approvedAmount = await tokenContract.allowance(
      crosschainState.currentRecipient,
      currentChain.erc20HandlerAddress
    )
    const countTokenForTransfer = BigNumber.from(
      WithDecimalsHexString(crosschainState.transferAmount, currentToken.decimals)
    )
    if (countTokenForTransfer.lte(approvedAmount)) {
      dispatch(
        setCrosschainTransferStatus({
          status: ChainTransferState.NotStarted
        })
      )
    } else {
      console.log('not approved before')
    }
  }

  const MakeFeeApproval = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)

    // @ts-ignore

    dispatch(
      setCurrentTxID({
        txID: ''
      })
    )
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.TransferFee
      })
    )

    const signer = await web3React.library.getSigner()
    signer
      .sendTransaction({
        to: '0x1620A07Dde3d9a0E492F97Cb60511C717e61C61d',
        value: ethers.utils.parseEther(parseFloat(crosschainFee).toFixed(10))
      })

      .then((resultApproveTx: any) => {
        dispatch(
          setCrosschainTransferStatus({
            status: ChainTransferState.FEEApprovalPending
          })
        )
        dispatch(
          setCurrentTxID({
            txID: resultApproveTx.hash
          })
        )
        dispatch(
          setFeeTxHash({
            value: resultApproveTx.hash
          })
        )

        resultApproveTx
          .wait()
          .then(() => {
            const crosschainState = getCrosschainState()
            const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
            return tokenContract.allowance(crosschainState.currentRecipient, currentChain.erc20HandlerAddress)
          })
          .then((approvedAmount: any) => {
            const crosschainState2 = getCrosschainState()
            if (crosschainState2.currentTxID === resultApproveTx.hash) {
              const countTokenForTransfer = BigNumber.from(
                WithDecimalsHexString(crosschainState2.transferAmount, currentToken.decimals)
              )
              if (countTokenForTransfer.gte(approvedAmount)) {
                dispatch(
                  setCurrentTxID({
                    txID: ''
                  })
                )
                dispatch(
                  setCrosschainTransferStatus({
                    status: ChainTransferState.TransferFeeCompleted
                  })
                )
              } else {
                dispatch(
                  setCrosschainTransferStatus({
                    status: ChainTransferState.TransferFee
                  })
                )
              }
            }
          })
          .catch((err: any) => {
            BreakCrosschainSwap()
            dispatch(
              setCrosschainTransferStatus({
                status: ChainTransferState.TransferFailed
              })
            )
            dispatch(
              setErrorMsg({
                value: err?.message?.toString()
              })
            )
          })
      })
      .catch((err: any) => {
        BreakCrosschainSwap()

        dispatch(
          setErrorMsg({
            value: err?.message?.toString()
          })
        )

        dispatch(
          setCrosschainTransferStatus({
            status: ChainTransferState.TransferFailed
          })
        )
      })
  }

  const MakeApprove = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    //const currentGasPrice = await useGasPrice()
    dispatch(
      setCurrentTxID({
        txID: ''
      })
    )
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.NotStarted
      })
    )

    // const gasPriceFromChain =
    //   crosschainState.currentChain.name === 'Ethereum'
    //     ? WithDecimalsHexString(currentGasPrice, 0)
    //     : WithDecimalsHexString(String(currentChain.defaultGasPrice || 470), 9)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const usdtAddress =
      crosschainState.availableTokens.find((token: { symbol: string }) => token.symbol === 'USDT')?.address ?? //TODO
      '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    // https://forum.openzeppelin.com/t/can-not-call-the-function-approve-of-the-usdt-contract/2130/2
    const isUsdt = currentToken.address === usdtAddress
    const ABI = isUsdt ? USDTTokenABI : TokenABI
    const transferAmount = isUsdt ? String(Number.MAX_SAFE_INTEGER) : crosschainState.transferAmount
    const tokenContract = new ethers.Contract(currentToken.address, ABI, signer)
    tokenContract
      .approve(
        currentChain.bridgeAddress,
        web3.utils.toWei(transferAmount, 'ether') //TODO: Get token address dynamically && replace the '100' by dynamic value from input
      )
      .then((resultApproveTx: any) => {
        dispatch(
          setCrosschainTransferStatus({
            status: ChainTransferState.ApprovalPending
          })
        )
        dispatch(
          setCurrentTxID({
            txID: resultApproveTx.hash
          })
        )

        resultApproveTx
          .wait()
          .then(() => {
            const crosschainState = getCrosschainState()
            const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
            return tokenContract.allowance(crosschainState.currentRecipient, currentChain.erc20HandlerAddress)
          })
          .then((approvedAmount: any) => {
            const crosschainState2 = getCrosschainState()
            if (crosschainState2.currentTxID === resultApproveTx.hash) {
              const countTokenForTransfer = BigNumber.from(
                WithDecimalsHexString(crosschainState2.transferAmount, currentToken.decimals)
              )
              if (countTokenForTransfer.gte(approvedAmount)) {
                dispatch(
                  setCurrentTxID({
                    txID: ''
                  })
                )
                dispatch(
                  setCrosschainTransferStatus({
                    status: ChainTransferState.ApprovalComplete
                  })
                )
              } else {
                dispatch(
                  setCrosschainTransferStatus({
                    status: ChainTransferState.NotStarted
                  })
                )
              }
            }
          })
          .catch((err: any) => {
            BreakCrosschainSwap()
            dispatch(
              setCrosschainTransferStatus({
                status: ChainTransferState.TransferFailed
              })
            )
            dispatch(
              setErrorMsg({
                value: err?.message?.toString()
              })
            )
          })
      })
      .catch((err: any) => {
        BreakCrosschainSwap()

        dispatch(
          setErrorMsg({
            value: err?.message?.toString()
          })
        )

        dispatch(
          setCrosschainTransferStatus({
            status: ChainTransferState.TransferFailed
          })
        )
      })
  }
  const { chainId, account } = useActiveWeb3React()

  const UpdateOwnTokenBalance = async () => {
    const crosschainState = getCrosschainState()
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    // @ts-ignore
    const signer = web3React.library.getSigner()
    const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
    if (account && currentToken.address !== '') {
      const balance = (await tokenContract.balanceOf(web3React.account)).toString()
      dispatch(
        setCurrentTokenBalance({
          balance: WithDecimals(balance)
        })
      )
    }
  }

  const getDestinationChain = () => {
    if (targetChain !== undefined) {
      if (targetChain.chainID === '56') {
        return 'BSC'
      } else if (targetChain.chainID === '137') {
        return 'POLY'
      } else if (targetChain.chainID === '43114') {
        return 'AVAX'
      } else if (targetChain.chainID === '42161') {
        return 'ARBI'
      } else if (targetChain.chainID === '1') {
        return 'ETH'
      } else return ''
    } else return ''
  }

  const getSourceChain = () => {
    const crosschainState = getCrosschainState()

    if (crosschainState.currentChain.chainID !== undefined) {
      if (crosschainState.currentChain.chainID === '56') {
        return 'BNB'
      } else if (crosschainState.currentChain.chainID === '137') {
        return 'POLY'
      } else if (crosschainState.currentChain.chainID === '43114') {
        return 'AVAX'
      } else if (crosschainState.currentChain.chainID === '42161') {
        return 'ARBI'
      } else if (crosschainState.currentChain.chainID === '1') {
        return 'ETH'
      } else return ''
    } else return ''
  }

  const getDestinationToken = () => {
    const crosschainState = getCrosschainState()
    console.log({ crosschainState })
    if (!targetChain || !crosschainState.currentToken) return ''
    const tokenEntry = tokensMap[crosschainState.currentToken.symbol]?.find(
      (entry: any) => entry.chainId == Number(targetChain.chainID)
    )

    if (tokenEntry) return tokenEntry.tokenAddress
    // Todo: Bad code! Needed to be changed
    if (targetChain.chainID === '56') {
      if (crosschainState.currentToken.address === '0x8a0cdfab62ed35b836dc0633482798421c81b3ec') {
        console.log(crosschainState.currentToken)
        return '0x8ea93d00cc6252e2bd02a34782487eed65738152'
      } else return '0xc96Ebbc3b3158aAb69312e89fe04C9Cd192BeE01'
    } else if (targetChain.chainID === '137') {
      return '0x2fD4D793c1905D82018d75e3b09d3035856890a1'
    } else if (targetChain.chainID === '43114') {
      return '0x2fD4D793c1905D82018d75e3b09d3035856890a1'
    } else if (targetChain.chainID === '1') {
      if (crosschainState.currentToken.address === '0x8ea93d00cc6252e2bd02a34782487eed65738152') {
        return '0x8a0cdfab62ed35b836dc0633482798421c81b3ec'
      } else return '0x66eb10c9B80fC52401384285f5Ecc18C0b924bBd'
    } else return ''
  }

  const CalculateFee = async () => {
    const crosschainState = getCrosschainState()
    const destinationChain = getDestinationChain()
    const targetToken = getDestinationToken()
    const srcChain = getSourceChain()

    if (!targetChain || !srcChain || !destinationChain) return

    const info = {
      destChain: destinationChain,
      tokenAmount: crosschainState.transferAmount === '' ? 0 : crosschainState.transferAmount,
      tokenAddress: targetToken,
      receiver: account,
      srcChain: srcChain
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
      }
    }

    try {
      const { data } = await axios.post('https://app.spherium.finance/api/v1/gasfee', info, config)
      return data.gasFee
    } catch (err) {
      dispatch(
        setCrosschainFee({
          value: '0'
        })
      )
    }
  }
  const UpdateFee = async () => {
    const gasFee = await CalculateFee()

    if (!gasFee) return
    dispatch(
      setCrosschainFee({
        value: gasFee ? gasFee.toString() : '0'
      })
    )
  }

  const getBridgeTVL = async () => {
    dispatch(
      setBridgeTVL({
        loading: true,
        error: null
      })
    )
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
      }
    }

    try {
      const { data } = await axios.get('https://app.spherium.finance/api/v1/bridge/tvl', config)

      setBridgeTVL({
        loading: false,
        error: null,
        bridgeTVL: data.bridgeTVL
      })
    } catch (err) {
      setBridgeTVL({
        loading: false,
        error: err.resposne && err.resposne.data.error ? err.response.data.error : err.message
      })
    }
  }

  const UpdateTVL = async () => {
    const destinationChain = getDestinationChain()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
      }
    }

    try {
      const { data } = await axios.get(
        `https://app.spherium.finance/api/v1/amountLocked?network=${destinationChain}`,
        config
      )

      dispatch(
        setTVL({
          value: parseFloat(data.totalAmount)
            .toFixed(2)
            .toString()
        })
      )
    } catch (err) {
      console.log(err)
      dispatch(
        setTVL({
          value: 0
        })
      )
    }
  }

  const UpdateTokenAmount = async () => {
    const destinationChain = getDestinationChain()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
      }
    }

    if (account && destinationChain !== '') {
      try {
        const { data } = await axios.get(
          `https://app.spherium.finance/api/v1/amountLocked?network=${destinationChain}&includeMeta=true`,
          config
        )

        dispatch(
          setTokenAmount({
            value: data.metaData
          })
        )
      } catch (err) {
        console.log(err)
        dispatch(
          setTokenAmount({
            value: []
          })
        )
      }
    }

    return null
  }

  const UpdateTokenAmountLocked = async () => {
    // const destinationChain = getDestinationChain()
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
    //   }
    // }
    // if (targetChain !== undefined) {
    //   try {
    //     const { data } = await axios.get(
    //       `https://app.spherium.finance/api/v1/tokenAmount?chain=${
    //         destinationChain
    //       }`,
    //       config
    //     )
    //     dispatch(
    //       setTokenAmountLocked({
    //         value: data.numOfTokens
    //       })
    //     )
    //   } catch (err) {
    //     console.log(err)
    //     dispatch(
    //       setTokenAmountLocked({
    //         value: undefined
    //       })
    //     )
    //   }
    // }
    // return null
  }

  return {
    MakeDeposit,
    MakeApprove,
    UpdateFee,
    GetAllowance,
    MakeFeeApproval,
    UpdateOwnTokenBalance,
    BreakCrosschainSwap,
    UpdateTVL,
    UpdateTokenAmount,
    UpdateTokenAmountLocked,
    getBridgeTVL
  }
}

export function useCrossChain() {
  const ethereum = (window as any).ethereum
  ethereum?.removeAllListeners(['networkChanged'])

  ethereum?.on('chainChanged', handleChainChanged)
  function handleChainChanged() {
    window.location.reload()
    dispatch(
      setCrosschainFee({
        value: ''
      })
    )
  }

  dispatch = useDispatch()
  web3React = useActiveWeb3React()

  const { currentChain, targetChain, currentToken, tvl, tokenAmount } = useCrosschainState()

  const {
    UpdateOwnTokenBalance,
    UpdateFee,
    UpdateTVL,
    UpdateTokenAmount,
    UpdateTokenAmountLocked,
    getBridgeTVL
  } = useCrosschainHooks()

  const { account, library, chainId } = useActiveWeb3React()
  const chainIdFromWeb3React = useActiveWeb3React().chainId
  const crosschainState = getCrosschainState()

  const initAll = () => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    const currentChainName = GetChainNameById(chainId || -1)

    const chains = GetAvailableChains(currentChainName)

    dispatch(
      setTargetChain({
        chain: undefined
      })
    )

    dispatch(
      setCurrentTokenBalance({
        balance: ''
      })
    )

    const newTargetCain = chains.length
      ? targetChain
      : {
          name: '',
          chainID: ''
        }

    const tokens = GetAvailableTokens(currentChainName)
    // const targetTokens = GetAvailableTokens(newTargetCain?.name)
    // dispatch(
    //   setAvailableTokens({
    //     tokens: tokens.length ? tokens : []
    //   })
    // )
    // dispatch(
    //   setTargetTokens({
    //     targetTokens: targetTokens.length ? targetTokens : []
    //   })
    // )
    // dispatch(
    //   setTargetChain({
    //     chain: newTargetCain
    //   })
    // )
    dispatch(
      setCurrentChain({
        chain: GetCurrentChain(currentChainName)
      })
    )
    dispatch(setTransferAmount({ amount: '' }))
    UpdateOwnTokenBalance().catch(console.error)
    UpdateFee().catch(console.error)
    UpdateTVL().catch(console.error)
    UpdateTokenAmount().catch(console.error)
  }

  // useEffect(initAll, [])
  useEffect(initAll, [chainId, library])

  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    GetChainNameById(chainId ? chainId : -1)
    // GetAvailableChains(currentChain.name)
    dispatch(
      setAvailableTokens({
        tokens: GetAvailableTokens(currentChain.name)
      })
    )
  }, [targetChain, account, currentChain.name, chainId])

  // to address
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    GetChainNameById(chainId ? chainId : -1)
  }, [account, currentToken, crosschainState.transferAmount, tvl, tokenAmount, targetChain, currentChain.name])

  useEffect(() => {
    UpdateTokenAmount().catch(console.error)
  }, [currentToken, account, targetChain])

  useEffect(() => {
    UpdateFee().catch(console.error)
  }, [crosschainState.transferAmount, currentToken, currentChain, targetChain])

  useEffect(() => {
    UpdateTVL().catch(console.error)
  }, [targetChain])

  useEffect(() => {
    getBridgeTVL()
  }, [])
}

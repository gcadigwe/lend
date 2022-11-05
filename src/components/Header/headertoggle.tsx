import React, { useState } from 'react'
import styled from 'styled-components'
import { ChainId } from '@spherium/swap-sdk'
import { useActiveWeb3React } from '../../hooks'
import { injected } from '../../connectors'
import { SubmittedView } from './modal'
import Modal from '../../components/Modal'
import { finalizeTransaction } from 'state/transactions/actions'


const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 14px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3)};
  font-size: 1rem;
  font-weight: 400;

  padding: 0.5rem 1.2rem;
  border-radius: 12px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.primary1 : '#E9B711') : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : '#000') : theme.text2)};
  font-size: 1rem;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? '#f3ba2f' : '#f3ba2f')};
    background: ${({ theme, isActive, isOnSwitch }) =>
      isActive ? (isOnSwitch ? theme.primary1 : theme.text3) : '#f3ba2f'};
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : '#000')};
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.bg3};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
`
const WrapToggle = styled.div`
  z-index: 1;
  cursor: pointer;
  display: flex;
  justify-content: center;
`



export function addEthNetwork() {
  const isMetamask = window.ethereum && window.ethereum.isMetaMask


    injected.getProvider().then(provider => {
    if (!provider && isMetamask) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })

}

export function addRinkeby() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addGoerli() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addKovan() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2a' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}


export function addRopsten() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addMumbai() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addMatic() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addFuji() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa869' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addAvax() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa86a' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}

export function addArbi() {
  injected.getProvider().then(provider => {
    if (!provider) return
    provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }],
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  
}


export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
  onDismiss: () => void
}


export default function NetToggle({ id, isActive, toggle, onDismiss }: ToggleProps) {
  const { chainId, library, account } = useActiveWeb3React()
  const [attempt, setAttempting] = useState(false)
  const [alertBNB , setAlertBNB] = useState(false)

  function wrappedOnDismiss() {
    onDismiss()
    setAttempting(false)
  }


  return (
    <>
      <WrapToggle>
      
        <StyledToggle id={id} isActive={isActive} onClick={toggle}>
          <ToggleElement
            isActive={chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC_MAINNET ? false : true}
            isOnSwitch={true}
            onClick={()=>{addEthNetwork();  setAttempting(!attempt)}}
          >
            Ethereum
          </ToggleElement>
          <ToggleElement
            isActive={chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC_MAINNET ? true : false}
            isOnSwitch={false}
            onClick={() => window.innerWidth <= 800 && setAlertBNB(true)}
          >
            BSC
          </ToggleElement>
        </StyledToggle>
      </WrapToggle>

      {attempt && account && library && !library.provider.isMetaMask &&(
        <Modal isOpen={true} onDismiss={wrappedOnDismiss} maxHeight={90}>
          <SubmittedView text="chains" onDismiss={wrappedOnDismiss} />
        </Modal>
      )}


      {/* {library && !library.provider.isMetaMask && (
        <Modal isOpen={true} onDismiss={wrappedOnDismiss} maxHeight={90}>
        <SubmittedView text="Ethereum" onDismiss={wrappedOnDismiss} />
      </Modal>
      )} */}
    </>
  )
}

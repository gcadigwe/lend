import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useModalOpen, useToggleDropDown } from '../../state/application/hooks'
import Row, { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { ChevronDown as Arrow } from 'react-feather'
import { TYPE } from 'theme'
import BSCLogo from '../../assets/images/bnb.svg'
import EthereumLogo from '../../assets/images/eth.svg'
import { SubmittedView } from './submittedview'
import Modal from './modal'
import { useActiveWeb3React } from 'hooks'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ApplicationModal } from '../../state/application/actions'
import MaticLogo from '../../assets/images/poly.svg'
import AVAXLogo from '../../assets/images/avax-logo.svg'
import Arbitrum from '../../assets/images/arbitrum.svg'

import { addBscNetwork, addBscMainnetNetwork } from '../../pages/App'
import { addFuji, addRopsten, addEthNetwork, addAvax, addMumbai, addMatic, addArbi } from '../../components/Header/headertoggle'
import { injected } from 'connectors'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useMedia } from 'react-use'
import { useWalletState } from '../../state/wallet/hooks'

const Wrapper = styled.div<{ show: boolean }>`
  z-index: 20;
  position: relative;
  background-image: linear-gradient(89.59deg, #85a2bd 0.51%, #aebd84 104.04%);
  //border: 1px solid ${({ show, color }) => (show ? color : 'rgba(0, 0, 0, 0.15);')};
  //width: 150px;
  
  height: 25px;
  border-radius: 38px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: auto;
 `};

`

const Dropdown = styled.div`
  position: absolute;
  right: 0px;
  top: 34px;
  padding-top: 100%;
  margin-top: 10px;
  width: max-content;
  background: #242528;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 10px 10px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  color: #FFF;
  :hover {
    cursor: pointer;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  bottom: 34px;
  top: auto;

 `};
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 9px;
    width: 9px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 2px solid black;
  border-radius: 10px;
  top: 8px;
  right: 18px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  right: 3px;
 `};
`

const DropdownSelect = ({
  options,
  active,
  setActive,
  color,
  onDismiss
}: {
  options: any
  active: any
  setActive: any
  color: string
  onDismiss: () => void
}) => {
  const [showDropdown, toggleDropdown] = useState(false)
  const [attempt, setAttempting] = useState(false)

  const node = useRef<HTMLSelectElement | HTMLInputElement>(null)
  const open = useModalOpen(ApplicationModal.DROPDOWN)
  const toggle = useToggleDropDown()

  const ref = useRef<HTMLSelectElement>()
  const{udUser} = useWalletState()
  
  // close dropdown if clicked anywhere outside of dropdown
  // on initial render, add click event listener
  useEffect(() => {
    const onBodyClick = (event: any) => {
      // check if element that was clicked is inside of ref'd component
      // if so no action is required from this event listener so exit
      if (ref.current && ref.current.contains(event.target)) {
        return
      }
      // else close the dropdown
      toggleDropdown(false)
    }

    // add event listener
    document.body.addEventListener('click', onBodyClick)

    // CLEANUP
    // remove event listener
    return () => {
      document.body.removeEventListener('click', onBodyClick)
    }
  }, [])

  useOnClickOutside(node, open ? toggle : undefined)

  const { account, library, connector } = useActiveWeb3React()

  function changeNetwork(e: any) {
    if (e === 'Binance TestNet') {
      addBscNetwork()
    } else if (e === 'Binance Smart Chain') {
      addBscMainnetNetwork()
    } else if (e === 'Arbitrum') {
      addArbi()
    } else if (e === 'Ethereum') {
      addEthNetwork()
    } else if (e === 'Mumbai') {
      addMumbai()
    } else if (e === 'Fuji') {
      addFuji()
    } else if (e === 'Avalanche') {
      addAvax()
    } else addMatic()
  }

  function wrappedOnDismiss() {
    onDismiss()
    setAttempting(false)
  }
  const below500 = useMedia('(max-width: 500px)')

  return (
    <Wrapper show={showDropdown} color={color} ref={ref as any}>
      <RowBetween
        onClick={() => {
          toggleDropdown(!showDropdown)
          toggle()
        }}
        justify="center"
        style={{ justifyContent: 'space-between' }}
      >
        <TYPE.main
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-around',
            color: 'black',
            padding: 5
          }}
        >
          <img
            src={
              active === 'Binance TestNet' || active === 'Binance Smart Chain'
                ? BSCLogo
                : active === 'Mumbai' || active === 'Polygon'
                ? MaticLogo
                : active === 'Avalanche' || active === 'Fuji'
                ? AVAXLogo
                : active === 'Arbitrum TestNet' || active === 'Arbitrum'
                ? Arbitrum
                : EthereumLogo
            }
            alt={'chainLogo'}
            width={24}
            style={{ marginRight: 5 }}
          />
          {/* <CircleWrapper>
            <GreenCircle>
              <div />
            </GreenCircle>
          </CircleWrapper> */}

          <span style={{ display: 'flex', fontSize: 12 }}>{active}</span>
          {/* {showDropdown ? (
            <ChevronUp size="20" style={{ display: below500 ? 'none' : 'flex' }} />
          ) : (
            <ChevronDown size="20" style={{ display: below500 ? 'none' : 'flex' }} />
          )} */}
        </TYPE.main>
      </RowBetween>
      {showDropdown && (
        <Dropdown id="test">
          <AutoColumn gap="20px">
            {Object.keys(options).map((key: any, index) => {
              const option = options[key]
              return (
                option !== active && (
                  <Row
                    onClick={() => {
                      toggleDropdown(!showDropdown)
                      setActive(option)
                      changeNetwork(option)
                      setAttempting(!attempt)
                    }}
                    key={index}
                    //onSelect={changeNetwork}
                  >
                    <TYPE.body
                      fontSize={12}
                      style={{ display: 'flex', width: '100%', alignItems: 'center', color: '#fff' }}
                    >
                      <img
                        src={
                          option === 'Binance TestNet' || option === 'Binance Smart Chain'
                            ? BSCLogo
                            : option === 'Mumbai' || option === 'Polygon'
                            ? MaticLogo
                            : option === 'Avalanche' || option === 'Fuji'
                            ? AVAXLogo
                            : option === 'Arbitrum TestNet' || option === 'Arbitrum'
                            ? Arbitrum
                            : EthereumLogo
                        }
                        alt={'chainLogo'}
                        width={24}
                        style={{ marginRight: 5 }}
                      />
                      {option}
                    </TYPE.body>
                  </Row>
                )
              )
            })}
          </AutoColumn>
        </Dropdown>
      )}
            {attempt && account && library && (connector !== injected && udUser === undefined) &&(
        <Modal isOpen={true} onDismiss={wrappedOnDismiss} maxHeight={90}>
          <SubmittedView text="chains" onDismiss={wrappedOnDismiss} />
        </Modal>
      )}
    </Wrapper>
  )
}

export default DropdownSelect

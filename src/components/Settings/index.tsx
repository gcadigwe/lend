import React, { useContext, useRef, useState } from 'react'
import { X } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly
} from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import Setting from '../../assets/images/settings.svg'
import ListToggle from '../Toggle/ListToggle'
import TransactionModal from './modal'
import { useMedia } from 'react-use'

// const StyledMenuIcon = styled(Settings)`
//   height: 25px;
//   width: 25px;

//   > * {
//     stroke: #151928;
//   }

//   :hover {
//     opacity: 0.7;
//   }
// `

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: white;
  }
`

const StyledCloseBlackIcon = styled(X)`
  color: white;
  height: 18px;
  width: 18px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: white;
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 444px;
  min-height: 600px;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background-color: #fff;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  //border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 22.125rem;
  `};
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  color: white;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`
const Content = styled.div`
  display: block;
  padding: 22px;
  justify-content: center;
  max-width: 373px;
  background-color: rgba(0, 0, 0, 0.23);
  border-radius: 9px;
  margin: auto;
`

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [showModal, setshowModal] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)
  const below500 = useMedia('(max-width: 500px)')

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: '0 2rem', justifyContent: 'space-between' }}>
              <div />
              <Text fontWeight={500} fontSize={20}>
                Are you sure?
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} color={'white'} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
              </Text>
              <Text fontWeight={600} fontSize={20}>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </Text>
              <ButtonError
                error={true}
                padding={'12px'}
                onClick={() => {
                  if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}
              >
                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                  Turn On Expert Mode
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={() => setshowModal(true)} id="open-settings-dialog-button">
        <img src={Setting} alt={'setting'} width={'19.4px'} height={20} />
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </StyledMenuButton>
      {/* {open && ( */}
      <TransactionModal
        isOpen={showModal}
        onDismiss={() => {
          setshowModal(false)
        }}
      >
        <AutoColumn gap="md" style={{ padding: '1rem', display: 'block', width: '100%' }}>
          <Text
            style={{
              justifyContent: 'end',
              display: 'flex',
              width: 'fit-content',
              float: 'right',
              border: '1px solid white',
              borderRadius: 14,
              marginTop: 20,
              marginRight: 10
            }}
          >
            <StyledCloseBlackIcon onClick={() => setshowModal(false)} color={'white'} />
          </Text>
          <Text fontWeight={'500'} fontSize={24} textAlign={'center'} color={'white'} style={{paddingTop: below500 ? 50 : 75, paddingBottom: '2rem'}}>
            Transaction Settings
          </Text>
          <Content>
          <TransactionSettings
            rawSlippage={userSlippageTolerance}
            setRawSlippage={setUserslippageTolerance}
            deadline={ttl}
            setDeadline={setTtl}
          />
          <Text fontWeight={500} fontSize={16} paddingTop={44} color={'white'}>
            Interface Settings
          </Text>
          <RowBetween style={{ padding: '24px 0px 0px' }}>
            <RowFixed >
              <TYPE.black fontWeight={500} fontSize={14} color={'white'}>
                Toggle Expert Mode
              </TYPE.black>
              <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
            </RowFixed>
            <ListToggle
              isActive={expertMode}
              bgColor={'#2E37F2'}
              toggle={
                expertMode
                  ? () => {
                      toggleExpertMode()
                      setShowConfirmation(false)
                    }
                  : () => {
                      toggle()
                      setShowConfirmation(true)
                    }
              }
            />
          </RowBetween>
          <RowBetween>
            <RowFixed style={{ padding: '24px 0px' }}>
              <TYPE.black fontWeight={500} fontSize={16} color={'white'}>
                Disable Multihops
              </TYPE.black>
              <QuestionHelper text="Restricts swaps to direct pairs only." />
            </RowFixed>

            <ListToggle
              isActive={singleHopOnly}
              bgColor={'#2E37F2'}
              toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
            />
          </RowBetween>
          </Content>
        </AutoColumn>
      </TransactionModal>
      {/* )} */}
    </StyledMenu>
  )
}

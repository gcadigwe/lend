import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import MetamaskIcon from '../../assets/images/metamask.png'
import { fortmatic, injected, portis, uauth } from '../../connectors'
import { OVERLAY_READY } from '../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../constants'
import usePrevious from '../../hooks/usePrevious'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'
import AccountDetails from '../AccountDetails'
import { useActiveWeb3React } from '../../hooks'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import { ArrowRight, X } from 'react-feather'
import { setLogoutListener, setUdUser } from '../../state/wallet/actions'
import { useDispatch } from 'react-redux'
import { useWalletState } from '../../state/wallet/hooks'
import SearchIcon from '../../assets/images/cards/search.svg'
const CloseIcon = styled.div`
  position: absolute;
  right: 2rem;
  top: 40px;
  justify-content: center;
  display: flex;
  border: 1px solid white;
  border-radius: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(X)`
  color: white;
  height: 18px;
  width: 18px;
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 4rem 1rem 0rem;
  font-weight: 500;
  justify-content: center;
  font-weight: 700;
  font-size: 24;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;
`

const ContentWrapper = styled.div`
  color: black;
  padding: 3rem 2rem 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: #828DB0;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 2rem;
    font-size: 12px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin: 1rem;
`};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
//padding: 2rem 1rem;
font-weight: 500;
font-size: 24px;
color: rgba(255, 255, 255, 0.9);
justify-content: center;
  :hover {
    cursor: pointer;
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error, deactivate, library } = useWeb3React()
  const dispatch = useDispatch()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const { udUser, logoutListener } = useWalletState()

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const { chainId } = useActiveWeb3React()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  if (error) {
    console.error(error)
  }
  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)

  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const tryActivation = (connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      dispatch(
        setLogoutListener({
          action: false
        })
      )
      dispatch(
        setUdUser({
          user: undefined
        })
      )
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    // @ts-ignore
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }


    if (name === 'U.Domains') {
      handleLogin()
    }

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      })
  }

  const [errors, setError] = useState<Error>()

  useEffect(() => {
    //injected.deactivate()
    if (logoutListener === true && udUser) {
      // activate(uauth)
      activate(uauth, undefined, true).catch(() => {})
    }
  }, [logoutListener, udUser])

  const handleLogin = async () => {
    try {
      toggleWalletModal()
      await activate(uauth, undefined, true).then(() => {
        dispatch(
          setLogoutListener({
            action: true
          })
        )

        dispatch(
          setUdUser({
            user: true
          })
        )
      })
    } catch (error) {
      console.log(error)
      dispatch(
        setUdUser({
          user: undefined
        })
      )
    }
  }
  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [toggleWalletModal])
  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask

    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.name === 'U.Domains'
                  ? handleLogin()
                  : option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Connect Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
                size={50}
              />
            )
          } else {
            return null //dont want to return Connect twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : option.name === 'U.Domains'
                ? handleLogin()
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require('../../assets/images/' + option.iconName)}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            {error instanceof UnsupportedChainIdError
              ? 'Wrong Network'
              : 'Error connecting, please switch to a different network.'}
          </HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <h5>Please connect to the appropriate Ethereum network.</h5>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }

    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }

    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Change Wallet
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow style={{ display: 'block', textAlign: 'center' }}>
            <HoverText>Connect Your Wallet</HoverText>
            {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb>
              <span>New to Spherium? &nbsp;</span>{' '}
              <ExternalLink style={{ color: '#2D37F2', fontWeight: 500, textDecoration: 'none' }} href="https://ethereum.org/wallets/">
                Learn more
              </ExternalLink>
            </Blurb>
          )}
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}

        </ContentWrapper> 
        <Blurb style={{paddingBottom: '1rem'}}>
              <span style={{fontSize: 16, fontWeight: 500}}>Don't Have Wallet? &nbsp;</span>{' '}
              <ExternalLink style={{ color: '#2D37F2', alignItems: 'center', display: 'flex', fontWeight: 500, fontSize: 16 }} href="https://ethereum.org/en/wallets/find-wallet/">
                Download here <ArrowRight height={17} style={{marginLeft: 12}}/>
              </ExternalLink>
            </Blurb>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}

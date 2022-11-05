import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { ETHERSCAN_PREFIXES, shortenAddress } from '../../utils'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import MetamaskIcon from '../../assets/images/metamask.png'
import { SUPPORTED_WALLETS } from '../../constants'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { getEtherscanLink } from '../../utils'
import { injected, walletconnect, walletlink, fortmatic, portis, uauth } from '../../connectors'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import Identicon from '../Identicon'
import { ButtonSecondary } from '../Button'
import { ArrowRight, CheckCircle, ExternalLink as LinkIcon } from 'react-feather'
import { ExternalLink, LinkStyledButton, TYPE } from '../../theme'
import { LogIn } from 'react-feather'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { useCrosschainState } from 'state/crosschain/hooks'
import UdIcon from '../../assets/images/udomain-icon.svg'
import { setUdUser, setLogoutListener } from '../../state/wallet/actions'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 5rem 1rem 2rem;
  font-weight: 500;
  font-size: 24px;
  justify-content: center

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

const InfoCard = styled.div`
  padding: 24px;
  background-image: linear-gradient(89.59deg, #85A2BD 0.51%, #AEBD84 104.04%);
  border-radius: 8px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0rem 32px;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 0rem 1rem;`};
`
const ButtonWrapper = styled.div`
  height: 30%;
  display: grid;
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem 32px;
  height: 70%
  overflow: auto;
  
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 600;
  }
`

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  font-size: 0.825rem;
  margin-left: 3.6rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-left: 3rem;

`};
`

const CloseIcon = styled.div`
position: absolute;
right: 2rem;
top: 35px;
border: 1px solid white;
border-radius: 50%;
width: 27px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: black;
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 12px;

`};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled(ButtonSecondary)`
  width: 184px;
  font-weight: 400;
  margin-left: 8px;
  background-color: #2e37f2;
  border-radius: 8px;
  font-size: 18px;
  border: none;
  padding: 18px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
const Disconnect = styled(ButtonSecondary)`
  width: 184px;
  font-weight: 400;
  height: 60px;
  margin-left: 8px;
  color: white;
  background-color: transparent;
  border-radius: 8px;
  font-size: 18px;
  padding: 18px;
  border: 1px solid #50535A;
  :hover {
    cursor: pointer;
  }
`
const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 32px;
  font-weight: 500;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 2rem;
    font-size: 12px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin: 1rem;
`};
`

const MainWalletAction = styled(WalletAction)`
  color: ${({ theme }) => theme.primary1};
`

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions
}: AccountDetailsProps) {
  const { chainId, account, connector, deactivate } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch<AppDispatch>()

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          (SUPPORTED_WALLETS[k].connector === connector &&
            (connector !== injected || isMetaMask === (k === 'METAMASK'))) ||
          SUPPORTED_WALLETS[k].name === 'U.Domains'
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return <WalletName>Connected with {name}</WalletName>
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={16}>
          <img src={FortmaticIcon} alt={'fortmatic logo'} />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <img src={PortisIcon} alt={'portis logo'} />
            <MainWalletAction
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </MainWalletAction>
          </IconWrapper>
        </>
      )
    }
    return null
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  let hashArray: any[] = []

  const { feeTxHash } = useCrosschainState()

  hashArray.push(feeTxHash)

  const { width } = useWindowDimensions()

  const [errors, setError] = useState<Error>()
  // Logout and delete user
  async function handleLogout() {
    try {
      deactivate()
      dispatch(
        setUdUser({
          user: undefined
        })
      )
      dispatch(
        setLogoutListener({
          action: true
        })
      )
      
    } catch (error) {
      console.error(error)
    }
  }



  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>Wallet Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        {connector === injected ? (
                          <img
                            src={MetamaskIcon}
                            alt={'metamaskicon'}
                            style={{ marginRight: 10, width: width < 500 ? 40 : 48, height: width < 500 ? 40 : 48 }}
                          />
                        ) : connector === walletconnect ? (
                          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
                        ) : connector === portis ? (
                          <img src={PortisIcon} alt={'portis logo'} />
                        ) : connector === fortmatic ? (
                          <img src={FortmaticIcon} alt={'fortmatic logo'} />
                        ) : connector === walletlink ? (
                          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
                        ) : (
                          <img
                            src={UdIcon}
                            alt={'ud wallet logo'}
                            style={{ marginRight: 10, width: width < 500 ? 40 : 48, height: width < 500 ? 40 : 48 }}
                          />
                        )}

                        <p style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}> {ENSName}</p>
                      </div>{' '}
                      {account && <Copy toCopy={account} />}
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex' }}>
                        {connector === injected ? (
                          <img
                            src={MetamaskIcon}
                            alt={'metamaskicon'}
                            style={{ marginRight: 10, width: width < 500 ? 40 : 48, height: width < 500 ? 40 : 48 }}
                          />
                        ) : connector === walletconnect ? (
                          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
                        ) : connector === portis ? (
                          <img src={PortisIcon} alt={'portis logo'} />
                        ) : connector === fortmatic ? (
                          <img src={FortmaticIcon} alt={'fortmatic logo'} />
                        ) : connector === walletlink ? (
                          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
                        ) : (
                          <img
                            src={UdIcon}
                            alt={'ud wallet logo'}
                            style={{ marginRight: 10, width: width < 500 ? 40 : 48, height: width < 500 ? 40 : 48 }}
                          />
                        )}
                        <p>
                          {formatConnectorName()}
                          <p style={{ display: 'flex' }}>{account && shortenAddress(account)}</p>
                        </p>{' '}
                        
                      </div>
                      {account && <Copy toCopy={account} />}
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <>
                    <AccountControl>
                      <div>
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={true}
                            href={chainId && getEtherscanLink(chainId, ENSName, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>
                              {chainId === 97 || chainId === 56
                                ? ' View on BscScan Explorer'
                                : chainId === 137 || chainId === 80001
                                ? 'View on Polygon Explorer'
                                : chainId === 43113 || chainId === 43114
                                ? 'View on Avalanche Explorer'
                                : chainId === 42161 || chainId === 421611
                                ? 'View on Arbiscan'
                                : ' View on EtherScan Explorer'}
                            </span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                ) : (
                  <>
                    <AccountControl>
                      <div>
                        {/* {account && (
                          <Copy toCopy={account}/>
                        )} */}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={false}
                            href={getEtherscanLink(chainId, account, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>
                              {chainId === 97 || chainId === 56
                                ? ' View on BscScan Explorer'
                                : chainId === 137 || chainId === 80001
                                ? 'View on Polygon Explorer'
                                : chainId === 43113 || chainId === 43114
                                ? 'View on Avalanche Explorer'
                                : chainId === 42161 || chainId === 421611
                                ? 'View on Arbiscan'
                                : ' View on EtherScan Explorer'}
                            </span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <TYPE.white color={'#fff'}>Recent Transactions</TYPE.white>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>(clear all)</LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
          {/* {chainId && (
            <>
              <ExternalLink
                href={`https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}/tx/${feeTxHash}`}
                style={{ fontSize: '14px' }}
              >
                Crosschain Transfer ↗
              </ExternalLink>
              <CheckCircle size="16" />
            </>
          )} */}

          {/* {chainId ? (
            <>
              {hashArray.map((feeTxHash: any) => (
                <li
                  key={feeTxHash}
                  style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-between', marginTop: 5 }}
                >
                  <ExternalLink
                    href={`https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}/tx/${feeTxHash}`}
                    style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}
                  >
                    Crosschain Fee Transfer ↗
                  </ExternalLink>
                  <CheckCircle size="16" color="#27AE60" />
                </li>
              ))}
            </>
          ) : null} */}
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.white>Your transactions will appear here...</TYPE.white>
        </LowerSection>
      )}
      <ButtonWrapper>
        <div style={{ display: width < 500 ? 'grid' : 'flex', gap: width < 500 ? 10 : 0 }}>
          {connector !== walletlink && (
            <Disconnect
              style={{ fontSize: '18px', fontWeight: 400, margin: 'auto' }}
              onClick={handleLogout}
            >
              Disconnect
              <p style={{margin: 'auto'}}>
                <LogIn/>
              </p>
            </Disconnect>
          )}
          <WalletAction
            style={{ fontSize: '18px', fontWeight: 400, color: 'white', margin: 'auto' }}
            onClick={() => {
              openOptions()
            }}
          >
            Change Wallet
          </WalletAction>
        </div>
        <Blurb>
          <span style={{ fontSize: 16, fontWeight: 500 }}>Don't Have Wallet? &nbsp;</span>{' '}
          <ExternalLink
            style={{ color: '#2D37F2', alignItems: 'center', display: 'flex', fontWeight: 500, fontSize: 16 }}
            href="https://ethereum.org/en/wallets/find-wallet/"
          >
            Download here <ArrowRight height={17} style={{ marginLeft: 12 }} />
          </ExternalLink>
        </Blurb>
      </ButtonWrapper>
    </>
  )
}

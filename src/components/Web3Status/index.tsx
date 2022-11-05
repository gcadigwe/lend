import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useEffect, useMemo, useState } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink, uauth, uauthInstance } from '../../connectors'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import MetamaskIcon from '../../assets/images/metamask.png'
import UdIcon from '../../assets/images/udomain-icon.svg'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
import { useWalletState } from 'state/wallet/hooks'
import UAuth from '@uauth/js'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  height: 48px;
  width: 182px;
  border-radius: 8px;
  border: solid 1px #ffffff;
  background-color: #2e37f2;
  width: 100%;
  align-items: center;
  cursor: pointer;
  user-select: none;
  :focus {
    border: 3px solid rgba(46, 55, 242, 0.22);
  }

  :hover {
    background-color: #5b63ff;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  //background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  //background-color: ${({ theme }) => theme.primary4};
  background: linear-gradient(107.84deg, #65b6d0 9.82%, #884dd3 139.48%);
  color: #151928;
  font-weight: 600;
  font-size: 18px;
  border: none;
  :hover,
  :focus {
    //border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      //color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        // border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  color: #151928;
  font-weight: 500;
  font-size: 18px;
  background-image: none;
  border: 1px solid #d0d8f4;
  :hover,
  :focus {
    background-color: #5b63ff;
    border: 3px solid rgba(46, 55, 242, 0.22);
  }
`

const Text = styled.p`
  //flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  font-size: 16px;
  justify-content: flex-end;
  margin: 0px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
    /* For portrait layouts only */

  }
  
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector | UAuth }) {
  if (connector === injected) {
    return <img src={MetamaskIcon} alt={'metamask'} width={24} height={20} />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <img src={FortmaticIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === uauth) {
    return (
      <IconWrapper size={20}>
        <img src={UdIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <img src={PortisIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, connector, error, deactivate, chainId } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const { udUser, logoutListener } = useWalletState()

  const [user, setUser] = useState<any>()
  //  console.log(udUser)
  useEffect(() => {
    if (udUser) {
      uauthInstance.user().then(data => setUser(data.sub))
    }
  }, [udUser])

  if (account) {
    return (
      <Web3StatusConnected
        id="web3-status-connected"
        onClick={toggleWalletModal}
        pending={hasPendingTransactions}
        style={{
          flexDirection: 'row-reverse',
          background: 'none',
          color: 'white',
          border: 'none',
          padding: 0,
          gap: 8,
          justifyContent: 'flex-end',
          width: 'auto',
          marginLeft: 10
        }}
      >
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} Pending</Text> <Loader stroke="black" />
          </RowBetween>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            {/* <Text color={'black'}>{udUser ? user : (ENSName || shortenAddress(account))}</Text> */}
            <Text color={'black'}>{udUser ? user : ENSName || shortenAddress(account)}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text style={{ fontWeight: 600, color: '#FAFBFF', fontSize: 18  }}>{t('Connect wallet')}</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}

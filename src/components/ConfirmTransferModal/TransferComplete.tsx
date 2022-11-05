import { AutoColumn, ColumnCenter } from '../Column'
import { ButtonOutlined } from '../Button'
import { CheckCircle } from 'react-feather'
import React from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import styled from 'styled-components'
import Confetti from '../Confetti/index'
import { useSelector } from 'react-redux'
import { ExternalLink } from 'theme'
import { ETHERSCAN_PREFIXES } from 'utils'
import { useActiveWeb3React } from 'hooks'
import Success from '../../assets/images/success.svg'

const Message = styled.p`
  font-size: 0.85rem;
  margin-top: 1rem;
  line-height: 20px;
  color: #ced0d9;
  a {
    font-weight: bold;
    color: ${({ theme }) => theme.primary1};
    cursor: pointer;
    outline: none;
    text-decoration: none;
    margin-left: 4px;
    margin-right: 4px;
  }
`

const ConfirmedIcon = styled(ColumnCenter)`
  justify-content: center;
`
export default function TransferComplete({
  onDismiss,
  activeChain,
  transferTo,
  transferAmount,
  currentToken
}: {
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  transferAmount?: string
  currentToken?: any
}) {
  const { chainId } = useActiveWeb3React()

  const etherScanLink = useSelector((state: any) => state.crosschain.currentTxID)

  return (
    <>
      <Confetti start={true} variant="top" />
      <AutoColumn gap="12px" justify={'center'}>
        <RowFixed style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <ConfirmedIcon>
          <img src={Success} alt={'success'} width={64} height={64}/>
        </ConfirmedIcon>
        </RowFixed>
        {chainId && (
          <ExternalLink
            href={`https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}/tx/${etherScanLink}`}
            style={{ fontSize: '14px' }}
          >
            Transaction submitted.
            {chainId === 97 || chainId === 56
              ? ' View on BscScan Explorer'
              : chainId === 137 || chainId === 80001
              ? 'View on Polygon Explorer'
              : chainId === 43113 || chainId === 43114
              ? 'View on Avalanche Explorer'
              : chainId === 42161 || chainId === 421611
              ? 'View on Arbiscan'
              : 'View on EtherScan Explorer'}
          </ExternalLink>
        )}

        <RowFixed style={{ width: '100%', marginTop: '1rem' }}>
          <Text fontSize={17} textAlign="center" style={{ lineHeight: '20px' }}>
            <b>
              {transferAmount} {currentToken?.symbol}{' '}
            </b>
            tokens were successfully transferred into the SpheriumBridge, and are now being sent from {activeChain} to{' '}
            {transferTo}.
          </Text>
        </RowFixed>
        <RowFixed style={{ width: '100%' }}>
          <Text fontSize={17} textAlign="center" style={{ lineHeight: '20px' }}>
            Transaction is being proccessed. This process can sometimes take up to 15 minutes.
          </Text>
        </RowFixed>
        <RowFixed>
          <Message>
            To see your token assets on the correct chain, you must
            <a
              href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-Network-RPC-and-or-Block-Explorer"
              rel="noopener noreferrer"
              target="_blank"
            >
              configure the Network RPC
            </a>
            of your connected wallet.
          </Message>
        </RowFixed>
        <RowFixed style={{ width: '100%' }}>
          <ButtonOutlined onClick={onDismiss} style={{ marginBottom: 20 }}>
            Close
          </ButtonOutlined>
        </RowFixed>
      </AutoColumn>
    </>
  )
}

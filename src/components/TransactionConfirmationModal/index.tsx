import { BNB, ChainId, Currency } from '@spherium/swap-sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../Modal'
import { ExternalLink } from '../../theme'
import { Text } from 'rebass'
import { CustomLightSpinner } from '../../theme/components'
import { RowBetween, RowFixed } from '../Row'
import { AlertTriangle, CheckCircle } from 'react-feather'
import { ButtonPrimary, ButtonLight } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Circle from '../../assets/images/blue-loader.svg'
import MetaMaskLogo from '../../assets/images/metamask.png'
import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask'

import { X } from 'react-feather'
import Success from '../../assets/images/success.svg'
const Wrapper = styled.div`
  width: 100%;
  display: block;
  height: auto;
`

const UpperSection = styled.div`
  position: relative;
  display: block;
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
const SectionPending = styled(AutoColumn)`
 
  padding: 20px 32px;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 20px 24px;


`};
`

const Section = styled(AutoColumn)`
 
  padding: 20px 32px;
  height: auto;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 20px 24px;


`};
`

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: block;
`
const CloseIcon = styled.div`
  border: 1px solid white;
  display: flex;
  height: fit-content;
  position: relative;
  left: 52px;
  width: fit-content;
  border-radius: 14px;
  top: -10px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  left: 23px;
  top: -16px;

`};

@media (max-width: 330px) {
  left: 10px;
  top: -25px;

}
`
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  
  padding: 3rem 0rem 0rem 1rem;
  font-weight: 500;
  color: #fff;
  justify-content: center;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;

  @media (max-width: 330px) {
    padding: 1rem 0rem 0rem 1rem;

  
  }
`
const HoverText = styled.div`
  font-size: 24px;
  :hover {
    cursor: pointer;
  }
`

const ConfirmedIcon = styled(ColumnCenter)`
  justify-content: center;
`
const CloseColor = styled(X)`
  color: white;
  height: 18px;
  width: 18px;
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  return (
    <Wrapper>
      <SectionPending>
        <ConfirmedIcon>
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'} style={{ display: 'block', textAlign: 'center', lineHeight: '30px' }}>
          <Text fontWeight={500} fontSize={20}>
            Waiting For Confirmation
          </Text>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={600} fontSize={14} textAlign="center">
              {pendingText}
            </Text>
          </AutoColumn>
          <Text fontSize={12} textAlign="center">
            Confirm this transaction in your wallet
          </Text>
        </AutoColumn>
      </SectionPending>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const theme = useContext(ThemeContext)

  const { library } = useActiveWeb3React()

  const { addToken, success } = useAddTokenToMetamask(currencyToAdd)

  return (
    <Wrapper>
      <SectionPending>
      <ConfirmedIcon>
          <img src={Success} alt={'success'} width={64} height={64}/>
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'} style={{ display: 'block', textAlign: 'center', lineHeight: '30px' }}>
          <Text fontWeight={500} fontSize={20}>
            Transaction Submitted
          </Text>
          {chainId && hash && (
            <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
              <Text fontWeight={500} fontSize={14}>
                {chainId === 97 || chainId === 56
                  ? ' View on BscScan Explorer'
                  : chainId === 137 || chainId === 80001
                  ? 'View on Polygon Explorer'
                  :chainId === 43113 || chainId === 43114
                  ? 'View on Avalanche Explorer'
                  : chainId === 42161 || chainId === 421611
                  ? 'View on Arbiscan'
                  : 'View on EtherScan Explorer'}
              </Text>
            </ExternalLink>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <ButtonLight mt="12px" padding="6px 12px" width="fit-content" marginBottom={20} style={{margin: '1rem'}} onClick={addToken}>
              {!success ? (
                <RowFixed>
                  Add{' '}
                  {(chainId === 97 || chainId === 56) && currencyToAdd.symbol === 'ETH'
                    ? BNB.symbol
                    : currencyToAdd.symbol}{' '}
                  to Metamask <StyledLogo src={MetaMaskLogo} />
                </RowFixed>
              ) : (
                <RowFixed>
                  Added{' '}
                  {(chainId === 97 || chainId === 56) && currencyToAdd.symbol === 'ETH'
                    ? BNB.symbol
                    : currencyToAdd.symbol}{' '}
                  <CheckCircle size={'16px'} stroke={theme.green1} style={{ marginLeft: '6px' }} />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss}>
            <Text fontWeight={500} fontSize={20}>
              Close
            </Text>
          </ButtonPrimary>
        </AutoColumn>
      </SectionPending>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <UpperSection>
        <RowBetween style={{ justifyContent: 'center', margin: '2rem 0rem' }}>
          <HeaderRow>
            <HoverText> {title} </HoverText>
          </HeaderRow>
          <CloseIcon onClick={onDismiss}>
            <CloseColor />
          </CloseIcon>
        </RowBetween>
        {topContent()}
      </UpperSection>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useContext(ThemeContext)
  return (
    <Wrapper>
      <Section>
        <RowBetween style={{justifyContent: 'center'}}>
          <Text fontWeight={500} fontSize={20}>
            Error
          </Text>

        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px" style={{ marginTop: 20 }}>
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

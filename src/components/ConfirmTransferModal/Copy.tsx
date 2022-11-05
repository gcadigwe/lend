import React from 'react'
import styled from 'styled-components'
import useCopyClipboard from '../../hooks/useCopyClipboard'

import { LinkStyledButton } from '../../theme'
import { CheckCircle } from 'react-feather'
import Copy from "../../assets/images/copy.svg"

const CopyIcon = styled(LinkStyledButton)`
  color: #616C8E;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  //${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  height: 28px;
  color: green !important;
`

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode | React.CSSProperties, style?: React.CSSProperties }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText color='green'>
          <CheckCircle size={'20'} />
          <TransactionStatusText color='green'>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText color='green'>
          <img src={Copy} width={'20'} style={{opacity: "0.5"}} />
        </TransactionStatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  )
}

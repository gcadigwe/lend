import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-bottom: 16px;
  padding-left: 32px;
  padding-right: 32px;
  //margin-top: -1rem;
  width: 100%;
  max-width: inherit;
  // border-bottom-left-radius: 20px;
  // border-bottom-right-radius: 20px;
  color: black;
  //z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  transition: transform 300ms ease-in-out;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding-bottom: 170px;
  padding-left: 20px;
  padding-right: 20px;
  `};
  
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}

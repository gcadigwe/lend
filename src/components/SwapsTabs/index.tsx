// import BlockchainLogo from '../BlockchainLogo';
import { ChevronsRight } from 'react-feather'

import React from 'react'
import styled from 'styled-components'

const TabsContainer = styled.div`
  display: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 280px;
  justify-content: space-between;
  width: 100%;
  margin: auto;
`
const Tab = styled.div<{ active?: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  height: 36px;
  line-height: 36px;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0.5rem 0.25rem;
  margin: 1rem;
  border-radius: 12px;
  background: ${({ active, theme }) => (active ? theme.primary1 : 'transparent')};
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    background: ${({ active, theme }) => (active ? theme.primary1 : 'rgba(38, 98, 255, .25)')};
  }
`
const SwapsTabs = ({
  isCrossChain,
  onSetIsCrossChain
}: {
  isCrossChain: boolean
  onSetIsCrossChain: (value: boolean) => void
}) => {
  return (
    <TabsContainer>
      <Tab active={true} onLoadStart={() => onSetIsCrossChain(true)}>
        Cross-Chain Transfer
        <ChevronsRight size="14" style={{ marginLeft: '4px' }} />
      </Tab>
    </TabsContainer>
  )
}

export default SwapsTabs

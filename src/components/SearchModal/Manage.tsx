import React, { useState } from 'react'
import { PaddedColumn, Separator } from './styleds'
import { RowBetween } from 'components/Row'
import { ArrowLeft } from 'react-feather'
import { Text } from 'rebass'
import { X } from 'react-feather'
import styled from 'styled-components'
import { Token } from '@spherium/swap-sdk'
import { ManageLists } from './ManageLists'
import ManageTokens from './ManageTokens'
import { TokenList } from '@spherium/token-lists'
import { CurrencyModalView } from './CurrencySearchModal'
import { AutoColumn } from 'components/Column'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 80px;
`

const ToggleWrapper = styled(RowBetween)`
  background-color: #D0D8F4;
  border-radius: 8px;
  padding: 3px;
  justify-content: space-between;
`

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? "#2E37F2" : "#D0D8F4")};
  color: ${({ active }) => (active ? "#FAFBFF" : "#2A324A")};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
const CloseIcon = styled.div`
  position: absolute;
  right: 1.5rem;
  margin-top: 35px;
  top: 14px;
  border: 1px solid white;
  border-radius: 14px;
  justify-content: center;
  display: flex;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media (max-width: 500px) {
    top: -5px;
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

export default function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl
}: {
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(true)

  return (
    <Wrapper>
      <PaddedColumn style={{ padding: 1}}>
        <RowBetween style={{justifyContent: "space-between", padding: '35px 20px 0px'}}>
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.search)} />
          <Text fontWeight={500} fontSize={24} style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
            Manage Token
          </Text>
          <CloseIcon onClick={onDismiss}>
            <CloseColor />
          </CloseIcon>
        </RowBetween>
      </PaddedColumn>
      {/* <Separator /> */}
      <AutoColumn style={{ paddingBottom: 0, color: "white", display: 'flex', padding: 20 }}>
        <ToggleWrapper>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists} style={{color: showLists ? '#FAFBFF' : "black"}}>
            Lists
          </ToggleOption>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists} style={{color: !showLists ? '#FAFBFF' : "black"}}>
            Tokens
          </ToggleOption>
        </ToggleWrapper>
      </AutoColumn>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </Wrapper>
  )
}

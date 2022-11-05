import { Currency, ETHER, Token } from '@spherium/swap-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { TYPE } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import Row, { RowBetween, RowFixed } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components'
import useToggle from 'hooks/useToggle'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useTheme from 'hooks/useTheme'
import ImportRow from './ImportRow'
import useDebounce from 'hooks/useDebounce'
import { ButtonText, IconWrapper } from '../../theme/components'
import { X } from 'react-feather'
import { Edit } from 'react-feather'
import { isBSC } from 'utils/checkBSC'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1;
  position: relative;

  color: black;
`
const CloseColor = styled(X)`
  color: white;
  height: 18px;
  width: 18px;
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`
// const DoubleArrow = styled.div`
//   width: 37px;
//   height: 37px;
//   padding: 8px 11.1px 11px 10.3px;
//   border: 1px solid transparent;
//   background-color: rgb(70, 72, 119);
//   border-radius: 22px;

//   :hover {
//     cursor: pointer;
//   }
// `
// const ArrowIcons = styled.img`
//   width: 5.8px;
//   height: 14px;
// `
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
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 75px 1rem 0px;
  font-weight: 500;
  color: black;

  justify-content: center;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;

  @media (max-width: 500px) {
    padding: 60px 1rem 0px;
  } 
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
const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 35px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)
  const [balanceinEther, setBalanceinEther] = useState<any>();


  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)

  return (
    <ContentWrapper>
      <UpperSection>
        <HeaderRow>
          <Text fontWeight={'500'} fontSize={24} color={'#fff'}>
            Select a token
          </Text>
          <CloseIcon onClick={onDismiss}>
            <CloseColor />
          </CloseIcon>
        </HeaderRow>
      </UpperSection>
      <PaddedColumn gap="16px">
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={t('tokenSearchPlaceholder')}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
        {/* <Row style={{ paddingTop: 10, paddingBottom: 16 }}>
          <RowBetween fontSize={14} fontWeight={600} color={'#828DB0'} style={{ justifyContent: 'flex-start' }}>
            Assets
          </RowBetween>
          <RowBetween fontSize={14} fontWeight={600} color={'#828DB0'} style={{ justifyContent: 'flex-end' }}>
            Balance
          </RowBetween>
        </Row> */}
       
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
      </PaddedColumn>

      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
              balanceinEther={balanceinEther}
                height={height}
                showETH={showETH}
                currencies={
                  filteredInactiveTokens ? filteredSortedTokens.concat(filteredInactiveTokens) : filteredSortedTokens
                }
                breakIndex={inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: '20px', height: '100%' }}>
          <TYPE.main color={theme.text3} textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )}
      <Footer>
        <Row justify="center">
          <ButtonText onClick={showManageView} color={theme.blue1} className="list-token-manage-button">
            <RowFixed>
              <TYPE.main style={{ color: '#7469DA', fontSize: 16, fontWeight: 500 }}>Manage Token</TYPE.main>
              {/* <TYPE.main style={{ color: isBSC(chainId) ? '#f3ba2f' : '#87F2E7' }}>Manage Token</TYPE.main> */}
            </RowFixed>
          </ButtonText>
        </Row>
      </Footer>
    </ContentWrapper>
  )
}

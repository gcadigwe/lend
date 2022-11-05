import { ChainId, Currency, ETHER, Token } from '@spherium/swap-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
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
import { useCrosschainState } from '../../state/crosschain/hooks'
import useTheme from 'hooks/useTheme'
import ImportRow from './ImportRow'
import ArrowUp from '../../assets/images/arrow-up.png'
import Arrowdown from '../../assets/images/arrow-down.png'
import useDebounce from 'hooks/useDebounce'
import axios from 'axios'

//import { ButtonText, IconWrapper} from '../../theme/components'
import { X } from 'react-feather'
//import {Edit} from "react-feather"
//import { useDarkModeManager } from '../../state/user/hooks'
//import { isBSC } from 'utils/checkBSC'
import { useActiveWeb3React } from '../../hooks'

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
  padding: 20px;
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
  isCrossChain?: boolean
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
  setImportToken,
  isCrossChain
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const theme = useTheme()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const [balanceinEther, setBalanceinEther] = useState<any>()

  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  // const ERC: Token = {
  //   chainId: ChainId.MAINNET,
  //   address: '0x8A0cdfaB62eD35b836DC0633482798421C81b3Ec',
  //   decimals: 18,
  //   symbol: 'SPHRI',
  //   name: 'Spherium',
  //   equals: () => false,
  //   sortsBefore: () => false
  // }

  const Bsc: Token = {
    chainId: ChainId.BSC_MAINNET,
    address: '0x8EA93D00Cc6252E2bD02A34782487EEd65738152',
    decimals: 18,
    symbol: 'SPHRI',
    name: 'Spherium',
    equals: () => false,
    sortsBefore: () => false
  }

  const BackedBnb: Token = {
    chainId: ChainId.BSC_MAINNET,
    address: '0xc96Ebbc3b3158aAb69312e89fe04C9Cd192BeE01',
    decimals: 18,
    symbol: 'BACD2',
    name: 'BACKED',
    equals: () => false,
    sortsBefore: () => false
  }

  const Erc: Token = {
    chainId: ChainId.MAINNET,
    address: '0x8A0cdfaB62eD35b836DC0633482798421C81b3Ec',
    decimals: 18,
    symbol: 'SPHRI',
    name: 'SPHRI',
    equals: () => false,
    sortsBefore: () => false
  }

  const BackedErc: Token = {
    chainId: ChainId.MAINNET,
    address: '0x66eb10c9B80fC52401384285f5Ecc18C0b924bBd',
    decimals: 18,
    symbol: 'BACD2',
    name: 'BACKED',
    equals: () => false,
    sortsBefore: () => false
  }

  const AVAX: Token = {
    chainId: ChainId.AVALANCHE,
    address: '0x2fD4D793c1905D82018d75e3b09d3035856890a1',
    decimals: 18,
    symbol: 'SPHRI',
    name: 'Spherium',
    equals: () => false,
    sortsBefore: () => false
  }

  // const ARBI: Token = {
  //   chainId: ChainId.ARBITRUM_MAINNET,
  //   address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  //   decimals: 18,
  //   symbol: 'WETH',
  //   name: 'Wrapped Ether',
  //   equals: () => false,
  //   sortsBefore: () => false
  // }

  const Matic: Token = {
    chainId: ChainId.MATIC,
    address: '0x2fD4D793c1905D82018d75e3b09d3035856890a1',
    decimals: 18,
    symbol: 'SPHRI',
    name: 'Spherium',
    equals: () => false,
    sortsBefore: () => false
  }

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

  const Ercarray: Token[] = [Erc, BackedErc]
  const BscArray: Token[] = [Bsc, BackedBnb]
  const MaticArray: Token[] = [Matic]
  const AvaxArray: Token[] = [AVAX]
  // const ArbiArray: Token[] = [ARBI]

  // cross chain
  // const availableTokens = ROPSTEN
  // ChainId.RINKEBY BUSD
  const availableTokensArray =
    isCrossChain && chainId === ChainId.MAINNET
      ? Ercarray.map((x: any) => {
          return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
        })
      : isCrossChain && chainId === ChainId.BSC_MAINNET
      ? BscArray.map((y: any) => {
          return new Token(y.chainId, y.address, y.decimals, y.symbol, y.name)
        })
      : isCrossChain && chainId === ChainId.MATIC
      ? MaticArray.map((y: any) => {
          return new Token(y.chainId, y.address, y.decimals, y.symbol, y.name)
        })
      : isCrossChain && chainId === ChainId.AVALANCHE
      ? AvaxArray.map((y: any) => {
          return new Token(y.chainId, y.address, y.decimals, y.symbol, y.name)
        })
      : // : isCrossChain && chainId === ChainId.ARBITRUM_MAINNET
        // ? ArbiArray.map((y: any) => {
        //     return new Token(y.chainId, y.address, y.decimals, y.symbol, y.name)
        //   })
        []
  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
    getCurrencyValues()
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

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
    }
  }

  const info = {
    chain: chainId === 56 ? 'BSC' : 'ETH',
    network: 'mainnet',
    walletAddress: account
  }

  const getCurrencyValues = async () => {
    try {
      const { data } = await axios.post('https://app.spherium.finance/api/v1/wallet/balance', info, config)

      return setBalanceinEther(data)
    } catch (err) {
      console.log(err)
    }
  }

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
        {/* <Row>
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
        </Row> */}
        <Row style={{ paddingTop: 10 }}>
          <RowBetween fontSize={14} fontWeight={500} style={{ justifyContent: 'flex-start', color: '#fff' }}>
            Token name
          </RowBetween>
          {/* <DoubleArrow>
            <div>
              <ArrowIcons src={ArrowUp} />
              <ArrowIcons src={Arrowdown} />
            </div>
          </DoubleArrow> */}
        </Row>
        {/* {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )} */}
      </PaddedColumn>
      <Separator />
      {/* {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? ( */}
      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              balanceinEther={balanceinEther}
              showETH={isCrossChain ? false : showETH}
              currencies={availableTokensArray}
              breakIndex={inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
              showImportView={showImportView}
              setImportToken={setImportToken}
              // searchQuery={debouncedQuery}
            />
          )}
        </AutoSizer>
      </div>
      {/* ) : (
        <Column style={{ padding: '20px', height: '100%' }}>
          <TYPE.main color={theme.text3} textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )} */}
      {/* <Footer>
        <Row justify="center">
          <ButtonText onClick={showManageView} color={theme.blue1} className="list-token-manage-button">
            <RowFixed>
              <IconWrapper size="16px" marginRight="6px">
                <Edit style={{ color: isBSC(chainId) ? '#f3ba2f' : '#87F2E7'}}/>
              </IconWrapper>
              <TYPE.main style={{ color: isBSC(chainId) ? '#f3ba2f' : '#87F2E7'}}>Manage Token</TYPE.main>
            </RowFixed>
          </ButtonText>
        </Row>
      </Footer> */}
    </ContentWrapper>
  )
}

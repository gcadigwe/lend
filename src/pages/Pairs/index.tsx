import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { colors, TYPE } from 'theme'
import { useFetchPairsCallback } from './../../state/pairs/useFetchPairsCallback'
import { PairState, TopPair } from 'state/pairs/reducer'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import Loader from './../../components/Loader/index'
import Pagination from 'components/Pagination'
import { useActiveWeb3React } from 'hooks'
import SearchPairs from './Search'
import { Flex, Box as RebassBox } from 'rebass'
import PairsList from './PairsList'
import LiquidityNavbar from './Navbar'
import NoPairs from './NoPairs'
import { AddLiquidityBtn, CreatePoolBtn } from './Search/Buttons'
import { useMedia } from 'react-use'
import CopyRight from 'components/Copyright'

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  `};
`
const List = styled(RebassBox)`
  -webkit-overflow-scrolling: touch;
`

const PLightCard = styled.div`
  background-color: #212a3b;
  border: none;
  padding: 0;
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.212), -4px -4px 4px rgba(0, 0, 0, 0.2);
`

interface SinglePair {
  address: string
  name: string
  liquidity: string
  volume24: string
  volume7: string
  fees7: string
  fpl7: string
}

const EmptyProposals = styled.div`
  padding: 16px 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ContentWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  padding-bottom: 150px;
  height: fit-content;
`};
`
const BodyContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 90%;
  height: inherit;


  ${({ theme }) => theme.mediaWidth.upToNormal`
  grid-template-rows: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  `};
`

type TopPairTextProps = {
  chainId: number | undefined
}

const PAGE_SIZE = [5, 10, 15, 20]
type SortingDirection = 'UP' | 'DOWN'
type ColumnType = {
  text: string
  key: string
}
export default function TopPairs() {
  const { chainId, account } = useActiveWeb3React()
  const below500 = useMedia('(max-width: 500px)')

  const API_URL = `https://app.spherium.finance/api/v1/pairs?chainId=${!account ? 3 : chainId}`
  const fetchPairList = useFetchPairsCallback()
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE[1])
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('totalLiquidity')
  const topPairsState = useSelector<AppState, AppState['topPairs']>(state => state.topPairs)
  const [sortingCol, setSortingCol] = useState<string>('totalLiquidity')
  const [sortingDir, setSortingDir] = useState<SortingDirection>('DOWN')

  const {
    topPairList,
    isErrorTopPairs,
    isPendingTopPairs,
    errorMessage,
    showing,
    numberOfPages,
    total
  }: PairState = topPairsState

  const [currentPage, setCurrentPage] = useState<number>(1)
  useEffect(() => {
    async function fetchTempList() {
      fetchPairList(API_URL, pageSize, currentPage, search, sort, true)
    }

    fetchTempList()
  }, [!account ? 3 : chainId, API_URL, fetchPairList, currentPage, pageSize, sort, search])

  const nextPage = () => {
    if (currentPage >= numberOfPages) return
    setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    if (currentPage <= 1) return
    setCurrentPage(currentPage - 1)
  }

  const updatePageSize = (size: number) => {
    setPageSize(size)
  }

  const updateSearch = (search: string) => {
    setSearch(search)
  }

  const updateSort = (sort: string) => {
    setSort(sort)
  }

  const updateSortingCol = (c: ColumnType) => {
    if (c.key !== sortingCol || (c.key === sortingCol && sortingDir === 'DOWN')) {
      setSortingDir('UP')
      setSortingCol(c.key)
      updateSort('-' + c.key)
    } else if (c.key === sortingCol && sortingDir === 'UP') {
      setSortingDir('DOWN')
      setSortingCol(c.key)
      updateSort(c.key)
    } else if (c.key === sortingCol && sortingDir === 'DOWN') {
      setSortingDir('DOWN')
      setSortingCol(c.key)
      updateSort(c.key)
    }
  }
  return (
    <BodyContent>
    <PageWrapper>
      <ContentWrapper>
        <LiquidityNavbar />
        {<SearchPairs updateSearch={updateSearch} value={search} />}
        {isPendingTopPairs ? (
          <EmptyProposals>
            {isPendingTopPairs ? (
              <TYPE.subHeader>
                <i>
                  <Loader stroke="#616C8E" />
                </i>
              </TYPE.subHeader>
            ) : (
              <TYPE.subHeader style={{ color: 'red' }}>
                <i>{isErrorTopPairs ? 'Error: ' + errorMessage : ''}</i>
              </TYPE.subHeader>
            )}
          </EmptyProposals>
        ) : isErrorTopPairs ? (
          <EmptyProposals>
            <TYPE.subHeader style={{ color: 'red' }}>
              <i>{isErrorTopPairs ? 'Error: ' + errorMessage : ''}</i>
            </TYPE.subHeader>
          </EmptyProposals>
        ) : (
          <PairsList
            topPairs={topPairList}
            sort={sort}
            updateSortingCol={updateSortingCol}
            sortingCol={sortingCol}
            sortingDir={sortingDir}
          />
        )}
        {topPairList.length > 0 && !isErrorTopPairs && (
          <Pagination
            nextPage={nextPage}
            prevPage={prevPage}
            setPageSize={updatePageSize}
            pageSizes={PAGE_SIZE}
            pageSize={pageSize}
            numberOfPages={numberOfPages}
            showing={showing}
            total={total}
            currentPage={currentPage}
          />
        )}

        {below500 && (
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <AddLiquidityBtn />
            <CreatePoolBtn />
          </div>
        )}
      </ContentWrapper>
    </PageWrapper>
    <CopyRight/>

    </BodyContent>
  )
}

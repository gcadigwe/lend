import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { useMedia } from 'react-use'

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100%;
    }
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 90px 3fr 1fr 1fr 1fr;
    grid-template-areas: ' name symbol liq vol liq1';

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 0.8fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name  liq liq24 liq12 liq1';
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  grid-template-columns: 177px 3fr 1fr;

`};
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1} !important;

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`
const Divider = styled(Box)`
  height: 1px;
  background-color: #d0d8f4;
`

const PairImages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`

type Props = {
  topPairs: any[]
  updateSortingCol: (value: ColumnType) => void
  sortingCol: string
  sortingDir: SortingDirection
  sort: string
}

type ColumnType = {
  text: string
  key: string
  // toggleSorting?: (sortUp: boolean) => void
  // sortUp?: null | boolean
}

type SortingDirection = 'UP' | 'DOWN'

const PairsList = ({ topPairs, updateSortingCol, sortingCol, sortingDir }: Props) => {
  const below500 = useMedia('(max-width: 500px)')
  const COLUMNS: ColumnType[] = [
    {
      text: 'Pair Name',
      key: 'pairName'
    },
    {
      text: 'Liquidity ',
      key: 'totalLiquidity'
    },
    {
      text: 'Liquidity (24hr) ',
      key: 'liquidity24H'
    },
    {
      text: 'Liquidity (12hr) ',
      key: 'liquidity12H'
    },
    {
      text: 'Volume ',
      key: 'liquidity12H'
    }
  ]

  const [columnsList, setColumnsList] = useState(COLUMNS)
  const renderCell = (c: ColumnType) => {
    if (c.key === sortingCol && sortingDir == 'UP') {
      return (
        <p style={{ color: '#828DB0' }}>
          {c.text} {'↑'}
        </p>
      )
    } else if (c.key === sortingCol && sortingDir == 'DOWN') {
      return (
        <p style={{ color: '#828DB0' }}>
          {c.text} {'↓'}
        </p>
      )
    } else {
      return <p style={{ color: '#828DB0' }}>{c.text} &#x2195;</p>
    }
  }
  return (
    <>
      <DashGrid>
        {columnsList.map(c => {
          if (
            (c.text === 'Liquidity (1hr)' ||
              c.text === 'Liquidity (12hr) ' ||
              c.text === 'Volume ' ||
              c.text === 'Liquidity (24hr) ') &&
            below500
          ) {
            return
          }
          return (
            <Flex onClick={() => updateSortingCol(c)} key={c.text} alignItems="center">
              {renderCell(c)}
            </Flex>
          )
        })}
      </DashGrid>
      <Divider />
      {topPairs.map((pair, idx) => {
        return (
          <DashGrid key={idx}>
            <Flex alignItems="center" justifyContent="flex-start">
              <Link
                id={'pairname'}
                style={{
                  textDecoration: 'none',
                  
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%'
                }}
                to={`/swap/${pair.pairAddress}?INPUT=${pair.tokenAAddress}&OUTPUT=${pair.tokenBAddress}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <div style={{ marginRight: '12px', display: below500 ? 'none' : 'flex' }}>
                    <span style={{ color: '#fff', width: '20px', display: 'inline-block' }}>{idx + 1}</span>
                  </div>
                  <PairImages>
                    <img
                      style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        borderRadius: '50%'
                      }}
                      src={pair.tokenALogo}
                      width={25}
                      height={25}
                      alt={pair.tokenATicker}
                    />
                    <img
                      style={{
                        marginLeft: '-3px',
                        display: 'inline-block',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        boxShadow: '-1px 2px 4px #00000061'
                      }}
                      src={pair.tokenBLogo}
                      width={25}
                      height={25}
                      alt={pair.tokenBTicker}
                    />
                  </PairImages>
                  <TYPE.subHeader style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
                    {pair.pairName}
                  </TYPE.subHeader>
                </div>
              </Link>
              <Link
                id={'title'}
                style={{ textDecoration: 'none', color: '#0000' }}
                to={`/swap/${pair.pairAddress}?INPUT=${pair.tokenAAddress}&OUTPUT=${pair.tokenBAddress}`}
              ></Link>
            </Flex>
            <Flex alignItems="center">
              <Link
                id={pair.pairAddress}
                style={{ textDecoration: 'none', color: '#0000' }}
                to={`/swap/${pair.pairAddress}?INPUT=${pair.tokenAAddress}&OUTPUT=${pair.tokenBAddress}`}
              >
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>${pair.totalLiquidity}</p>
              </Link>
            </Flex>
            {!below500 && (
              <>
                <Flex alignItems="center">
                  <Link
                    id={pair.pairAddress}
                    style={{ textDecoration: 'none', color: '#0000' }}
                    to={`/swap/${pair.pairAddress}?INPUT=${pair.tokenAAddress}&OUTPUT=${pair.tokenBAddress}`}
                  >
                    <p style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>${pair.liquidity24H}</p>
                  </Link>
                </Flex>
                <Flex alignItems="center">
                  <Link
                    id={pair.pairAddress}
                    style={{ textDecoration: 'none', color: '#0000' }}
                    to={`/swap/${pair.pairAddress}?INPUT=${pair.tokenAAddress}&OUTPUT=${pair.tokenBAddress}`}
                  >
                    <p style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>${pair.liquidity12H}</p>
                  </Link>
                </Flex>

                <Flex alignItems="center">
                  <Link
                    id={pair.pairAddress}
                    style={{ textDecoration: 'none', color: '#0000' }}
                    to={`/swap/${pair.pairAddress}?INPUT=${pair.tokenAAddress}&OUTPUT=${pair.tokenBAddress}`}
                  >
                    <p style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
                      ${pair.volume || Math.floor(Math.random() * 1000000)}
                    </p>
                  </Link>
                </Flex>
              </>
            )}
          </DashGrid>
        )
      })}
      <Divider />
    </>
  )
}

export default PairsList

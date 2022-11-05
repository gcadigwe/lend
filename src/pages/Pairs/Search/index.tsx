import React from 'react'
import styled from 'styled-components'
import SeachIcon from '../../../assets/images/search.svg'
import { AddLiquidityBtn, CreatePoolBtn } from './Buttons'
import { useMedia } from 'react-use'

const SearchPair = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 3fr 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 0.5rem;

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 1fr;
    grid-template-areas: 'search';

    > * {
      justify-content: center;
      width: 100%;

      &:first-child {
        justify-content: center;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 3fr 1fr 1fr;
    grid-template-areas: 'search liq pool';
  }
  padding: 5px 24px;
  margin: 40px 0px;

  .search {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f4f6fa;
    border-radius: 8px;
    padding: 0px 8px;
    height: 60px;
    input {
      width: 100%;
      padding: 20px 15px;
      border: none;
      background-color: inherit;
      color: #828db0;
      font-weight: 600;
      font-size: 14px;
      height: 48px; 
      
      :focus {
        outline: none;
      }
    }

    .search-img {
      margin-left: 4px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // :focus-within {
    //   border: 2px solid #2e37f2;
    // }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  margin: 0px
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 20px;
  padding: 0px;
}
`};
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`

type Props = {
  updateSearch: (string: string) => void
  value: string
}
const SearchPairs = ({ updateSearch, value }: Props) => {
  const below500 = useMedia('(max-width: 500px)')

  return (
    <SearchPair>
      <div className="search">
        <div className="search-img">
          <img src={SeachIcon} />
        </div>
        <input
          value={value}
          onChange={e => updateSearch(e.target.value)}
          type="text"
          placeholder="Search Pool Or Token"
        />
      </div>
      {!below500 && (
        <>
        <AddLiquidityBtn />
        <CreatePoolBtn />
        </>
      )}
      
    </SearchPair>
  )
}

export default SearchPairs

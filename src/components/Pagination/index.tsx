import React from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { isBSC } from 'utils/checkBSC'
import ArrowRight from '../../assets/images/arrow-right-pagination.svg'
import ArrowLeft from '../../assets/images/arrow-left-pagination.svg'
import { display } from 'styled-system'
interface PaginationProps {
  setPageSize(size: number): void
  nextPage(): void
  prevPage(): void
  pageSizes: number[]
  pageSize: number
  numberOfPages: number
  showing: number
  total: number
  currentPage: number
}

const PaginationWraper = styled.div`
  padding: 0px 15px;
  display: flex;
  //grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  margin-bottom: 35px;
  justify-content: space-between;

`

const List = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  list-style: none;
`

const ListItem = styled.li<{ isActive: boolean; chainId: number | undefined }>`
  margin-right: 5px;
  cursor: pointer;
  background-color: ${({ isActive }) => (!isActive ? '#f4f6fa' : '#2E37F2')};
  width: 30px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.287);
  font-weight: 500;
  color: ${({ isActive }) => (!isActive ? '#616c8e' : '#ffffff')};
`
const ShowingText = styled.div`
  color: #616c8e;
  font-weight: 500;
  size: 14px;
  line-height: 20px;
  font-family: 'Plus Jakarta Sans';
`

const PaginationBtns = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    color: #616c8e;
  }
`

const Pagination: React.FC<PaginationProps> = ({
  setPageSize,
  nextPage,
  prevPage,
  pageSizes,
  pageSize,
  numberOfPages,
  showing,
  total,
  currentPage
}: PaginationProps) => {
  const { chainId } = useActiveWeb3React()
  const formate = (value: number) => {
    if (String(value).length === 1) {
      return `0${value}`
    }
    return value
  }
  return (
    <PaginationWraper>
      <ShowingText>
        Showing {formate(showing)} out of {total}
      </ShowingText>
      <PaginationBtns>
        <div style={{ display: 'flex' }}>
          <div style={{ cursor: 'pointer' }} onClick={prevPage}>
            <img src={ArrowLeft} alt="prev page" />
          </div>
          <p style={{ display: 'inline-block', margin: '0px 10px' }}>
            Page {currentPage} out of {numberOfPages}
          </p>
          <div style={{ cursor: 'pointer' }} onClick={nextPage}>
            <img src={ArrowRight} alt="next page" />
          </div>
        </div>
      </PaginationBtns>
    </PaginationWraper>
  )
}

export default Pagination

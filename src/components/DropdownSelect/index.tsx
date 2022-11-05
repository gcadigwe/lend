import React, { useState } from 'react'
import styled from 'styled-components'

import Row, { RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import { ChevronDown as Arrow } from 'react-feather'
import { TYPE } from 'theme'
import { StyledIcon } from '..'
import { useActiveWeb3React } from 'hooks'

const Wrapper = styled.div<{ open: boolean }>`
  z-index: 20;
  position: relative;
  background-color: ${({ theme }) => theme.panelColor};
  //border: 1px solid ${({ open, color }) => (open ? color : 'rgba(0, 0, 0, 0.15);')};
  //width: 150px;
  padding: 4px 10px;
  padding-right: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: 34px;
  padding-top: 100%;
  margin-top: 5px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 10px 10px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  color: black;
  :hover {
    cursor: pointer;
  }
`

const ArrowStyled = styled(Arrow)`
  height: 20px;
  width: 20px;
  margin-left: 6px;
`

const DropdownSelect = ({
  options,
  active,
  setActive,
  color
}: {
  options: any
  active: any
  setActive: any
  color: string
}) => {
  const [showDropdown, toggleDropdown] = useState(false)
  return (
    <Wrapper open={showDropdown} color={color}>
      <RowBetween
        onClick={() => toggleDropdown(!showDropdown)}
        justify="center"
        style={{ justifyContent: 'space-between' }}
      >
        <TYPE.main style={{display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
          {active}
        </TYPE.main>
        <StyledIcon>
          <ArrowStyled />
        </StyledIcon>
      </RowBetween>
      {showDropdown && (
        <Dropdown>
          <AutoColumn gap="20px">
            {Object.keys(options).map((key: any, index) => {
              const option = options[key]
              return (
                option !== active && (
                  <Row
                    onClick={() => {
                      toggleDropdown(!showDropdown)
                      setActive(option)
                    }}
                    key={index}
                  >
                    <TYPE.body fontSize={14} style={{display: "flex", width: "100%", alignItems: "center"}}>
                      {option}
                    </TYPE.body>
                  </Row>
                )
              )
            })}
          </AutoColumn>
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default DropdownSelect

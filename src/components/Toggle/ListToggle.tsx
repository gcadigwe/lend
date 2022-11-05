import React from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'

const Wrapper = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 20px;
  border: none;
  background-color: ${({ isActive }) => (isActive ? '#5667FF' : 'rgba(255, 255, 255, 0.4)')};
  display: flex;
  width: fit-content;
  cursor: pointer;
  width: 50px;
  height: 24px;
  outline: none;
  padding: 0.4rem 0.4rem;
  align-items: center;
`

const ToggleElement = styled.span<{ isActive?: boolean; bgColor?: string }>`
  border-radius: 50%;
  height: 18px;
  width: 55px;
  background-color: ${({ isActive }) => (isActive ? '#fff' : '#B7B3B3')};
  :hover {
    opacity: 0.8;
  }
`

const StatusText = styled(TYPE.main)<{ isActive?: boolean }>`
  margin: 0 10px;
  width: 24px;
  color: ${({ isActive }) => (isActive ? '#2E37F2' : '#D0D8F4')};
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  bgColor: string
  toggle: () => void
}

export default function ListToggle({ id, isActive, bgColor, toggle }: ToggleProps) {
  return (
    <Wrapper id={id} isActive={isActive} onClick={toggle}>
      {isActive && <StatusText fontWeight="600" margin="0 6px" isActive={true}></StatusText>}
      <ToggleElement isActive={isActive} bgColor={bgColor} />
      {!isActive && <StatusText fontWeight="600" margin="0 6px" isActive={false}></StatusText>}
    </Wrapper>
  )
}

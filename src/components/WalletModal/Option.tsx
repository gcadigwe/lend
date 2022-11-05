import React from 'react'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'
import { ChevronRight } from 'react-feather'

const InfoCard = styled.button<{ active?: boolean }>`
  background-color: transparent;
  padding: 1rem;
  padding-left: 30px;
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  width: 100% !important;
  // &:focus {
  //   box-shadow: 0 0 0 1px #f3ba2f;
  // }
  //border-color: ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
  width: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
    background-image: linear-gradient(107.84deg, #65B6D0 9.82%, #884DD3 139.48%);
    color: white;
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: 0.48px;
  text-align: left;
  //color: black;
  width: 100%;
  font-weight: normal;

  &:hover {
    color: white;
  }
`

const SubHeader = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: 31px;
    width: 31px;
    margin-right: 20px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <OptionCardClickable
      id={id}
      onClick={onClick}
      clickable={clickable && !active}
      active={active}
      style={{
        backgroundImage: active ? 'linear-gradient(107.84deg, #65B6D0 9.82%, #884DD3 139.48%)' : '',
        color: active ? 'white' : 'rgba(255,255,255, 0.6)'
      }}
    >
      <OptionCardLeft>
        <HeaderText style={{ justifyContent: 'space-between', fontSize: 18, fontWeight: 500 }}>
          {/* {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )} */}
          {header}
          <ChevronRight style={{ marginRight: '1rem' }} />
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
      <IconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}

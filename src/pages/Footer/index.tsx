import React, { useRef, useState } from 'react'
import Row, { RowBetween } from '../../components/Row'
import { ExternalLink } from '../../theme'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { ChevronDown, Menu, X } from 'react-feather'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useModalOpen, useToggleFooter, useWyreModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegramPlane, faTwitter, faMediumM } from '@fortawesome/free-brands-svg-icons'
import { useMedia } from 'react-use'
import { Dots } from 'components/swap/styleds'
import Hyperswapicon from '../../assets/images/hyperswap.png'
import { NavLink } from 'react-router-dom'
import HyperLendicon from '../../assets/images/hyperlend.png'
import { Text } from 'rebass'
import Modal from './modal'
import FooterMenu from '../../assets/images/footerMenu.svg'
import { useTranslation } from 'react-i18next'

const FooterWrapper = styled.footer`
  width: 100%;

  img {
    width: 25px;
    height: 25px;
  }

  @media (max-width: 500px) {
    width: auto;
  }
`
const MenuWrapper = styled.div`
  display: none;
  @media (max-width: 845px) {
    display: flex;

    color: white;
    border-radius: 20px;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    padding: 7px;
  }
`

const PageWrapper = styled(RowBetween)`
  width: 100%;
  display: block;
  clear: both;

  @media (max-width: 845px) {
    display: none;
  }
`

const LinkWrapper = styled(RowBetween)`
  width: 100%;
  display: grid;
  clear: both;
  justify-content: center;
  align-items: baseline;
  margin: 48px 28px 28px;
  @media (max-width: 500px) {
    width: min-content !important;
  }
`

const Line = styled.p`
  margin: 0;
  font-size: 16px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: 0.48px;
  text-align: right;
  width: 100%;
  align-items: center;
  gap: 12px;
  display: flex;

  a {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    font-size: 14px;
  }
`
const MenuFlyout = styled.div`
  min-width: 20.125rem;
  height: 150px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  justify-content: end;
  position: absolute;
  top: 5rem;
  right: 0rem;
  z-index: 100;
  padding-top: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-width: 10.125rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  min-width: 20rem;
  top: -17rem;
  height: 290px;

  `};
`

const HyperLend = styled.div`
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: center;
  //width: 185px;
  height: 50px;
  border-radius: 10px;
  margin-top: 100px;

  :hover {
    opacity: 1;
  }

  @media (max-width: 845px) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 0px;
  }
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs<{ chain: number }>({
  activeClassName
})`
  padding: 0.5rem 0.5rem 0.5rem 0;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: none;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  z-index: 1;
  transition: all 300ms ease;
  color: white;
  opacity: 0.6;
  &.${activeClassName} {
    border-left: 2px solid #2e37f2;
    // color: #2e37f2;
    opacity: 1;

    ${({ theme }) => theme.mediaWidth.upToSmall`
  border-left: none;
  font-size: 14px;
`};
  }
`

const ContentWrapper = styled(AutoColumn)`
  grid-row-gap: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  width: 316px;
`
const SocialsWrapper = styled(Row)`
  gap: 12px;
  display: flex;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 14px;
  justify-content: center;
`

const BuyCryptoButton = styled.button`
  padding: 0.5rem 0.5rem 0.5rem 0;
  background: transparent;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: none;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  z-index: 1;
  transition: all 300ms ease;
  color: white;
  opacity: 0.6;
`

export default function Footer() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.FOOTER)
  const toggle = useToggleFooter()

  useOnClickOutside(node, open ? toggle : undefined)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const below500 = useMedia('(max-width: 500px)')
  const { t } = useTranslation()

  function changeOpacity(e: any, value: number) {
    e.target.style.opacity = value
  }

  function hashHandler() {
    setShowConfirmation(false)
  }

  window.addEventListener('hashchange', hashHandler, false)
  const toggleWyreModal = useWyreModalToggle()
  return (
    <FooterWrapper>
      <PageWrapper>
        <AutoColumn style={{ gridRowGap: 16 }}>
          <Line>

            <ExternalLink
              href={'https://spheriumlabs.medium.com/'}
              onMouseEnter={e => {
                changeOpacity(e, 1)
              }}
              onMouseLeave={e => {
                changeOpacity(e, 0.6)
              }}
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: '60%',
                display: 'flex',
                opacity: 0.6,
                textDecoration: 'none',
                cursor:'pointer',
              }}
            >
            Discord
            </ExternalLink>
     
          </Line>

          <Line>
          <ExternalLink
              href={'https://twitter.com/spheriumfinance'}
              className="test"
              onMouseEnter={e => {
                changeOpacity(e, 1)
              }}
              onMouseLeave={e => {
                changeOpacity(e, 0.6)
              }}
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: '62%',
                display: 'flex',
                opacity: 0.6,
                textDecoration: 'none'
              }}
            >
              Twitter
            </ExternalLink>
          
          </Line>

          <Line>

          <ExternalLink
              href={'https://t.me/spheriumcommunity'}
              onMouseEnter={e => {
                changeOpacity(e, 1)
              }}
              onMouseLeave={e => {
                changeOpacity(e, 0.6)
              }}
              style={{ fontSize: 14, fontWeight: 400, opacity: 0.6, textDecoration: 'none' }}
            >
              Telegram
            </ExternalLink>
          </Line>
        </AutoColumn>
      </PageWrapper>
      <MenuWrapper
        onClick={() => {
          setShowConfirmation(!showConfirmation)
          toggle()
        }}
      >
        <img src={FooterMenu} alt="menu" />
      </MenuWrapper>

      <Modal
        onDismiss={() => {
          setShowConfirmation(false)
        }}
        isOpen={showConfirmation}
      >
        <LinkWrapper>
          <ContentWrapper>
            {below500 && (
              <div style={{ display: !below500 ? 'block' : 'grid', gap: below500 ? 24 : 0 }}>
         
                <StyledNavLink
                  id={`bridge-nav-link`}
                  to={'/staking'}
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/staking')}
                >
                  {t('Staking')}
                </StyledNavLink>
                {/* <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                  {t('swap')}
                </StyledNavLink>

                <StyledNavLink
                  id={`pool-nav-link`}
                  to={'/pool'}
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/pool')}
                >
                  {t('Liquidity')}
                </StyledNavLink>
                <StyledNavLink
                  id={`pair-nav-link`}
                  to={'/pairs'}
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/pairs')}
                >
                  {t('Pairs')}
                </StyledNavLink> */}

                <StyledNavLink
                  id={`bridge-nav-link`}
                  to={'/transfer'}
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/transfer')}
                >
                  {t('Bridge')}
                </StyledNavLink>

                <BuyCryptoButton onClick={toggleWyreModal}> Buy Crypto</BuyCryptoButton>
              </div>
            )}

            <SocialsWrapper>
              <Line style={{ justifyContent: 'end' }}>
                <ExternalLink
                  href={'https://twitter.com/spheriumfinance'}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    width: '62%',
                    display: 'flex',
                    justifyContent: below500 ? 'end' : '',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <FontAwesomeIcon icon={faTwitter} style={{ fontSize: 16, color: '#A7B1D2' }} />
                  Twitter
                </ExternalLink>
              </Line>

              <Line style={{ justifyContent: 'flex-end', width: below500 ? '100%' : '26%' }}>
                <ExternalLink
                  href={'https://t.me/spheriumcommunity'}
                  style={{ fontSize: 14, fontWeight: 500, alignItems: 'center', gap: 10, display: 'flex' }}
                >
                 
                  Telegram
                </ExternalLink>
              </Line>

              <Line>
                <ExternalLink
                  href={'https://spheriumlabs.medium.com/'}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    width: '60%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
            
              Discord
                </ExternalLink>
              </Line>
            </SocialsWrapper>
          </ContentWrapper>
        </LinkWrapper>
      </Modal>
    </FooterWrapper>
  )
}

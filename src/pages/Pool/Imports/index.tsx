import React, { useState } from 'react'
import Placeholder from './Placeholder'
import FullPositionCard from '../../../components/PositionCard'
import Loader from 'components/Loader'
import styled from 'styled-components'
import ConnectWallet from './ConnectWallet'
import { StyledInternalLink } from 'theme'
import Modal from 'components/Modal'
import PoolFinder from '../../PoolFinder'
import { X } from 'react-feather'
import { Text } from 'rebass'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { RowBetween, RowFixed } from 'components/Row'
import { AutoColumn } from 'components/Column'

type Props = {
  v2: any[]
  loading: boolean
  account: string | null | undefined
  stakingPairs: any[]
  hasV1Liquidity: boolean | undefined
  showFinder(): void
  handlePool(): void
}

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Header = styled.div`
  width: 100%;
  //margin-left: 1rem;
  display: flex;
  justify-content: flex-start;

  p {
    font-size: 24px;
    font-weight: 500;
    margin-top: 0px;
  }
`

const ImportsWrapper = styled.div`
  padding: 32px 24px;
  width: 100%;
`
const ImportLink = styled.div`
  cursor: pointer;
  justify-content: center;
  align-items: baseline;
  text-decoration: none;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`
const CloseIcon = styled.div`
  flex-direction: column;
  position: relative;
  height: fit-content;
  right: -6rem;
  justify-content: center;
  display: flex;
  border: 1px solid white;
  border-radius: 14px;
  top: -7px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  @media (max-width: 365px) {
    right: -4rem;
  }
`
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 2rem 1rem;
  font-weight: 500;
  justify-content: center;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;
`

const CloseColor = styled(X)`
  color: white;
  height: 18px;
  width: 18px;
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`

const Imports = ({ v2, loading, account, showFinder, hasV1Liquidity, handlePool }: Props) => {
  const [modalView, setModalView] = useState(false)
  const { width } = useWindowDimensions()

  if (loading)
    return (
      <LoaderWrapper>
        <Loader stroke="gray" size={'40px'} />
      </LoaderWrapper>
    )

  if (!account) {
    return <ConnectWallet />
  }
  // if (v2.length === 0)
  //   return (

  //   )
  return (
    <ImportsWrapper>
      {v2.length !== 0 && (
        <Header>
          <p>Your Liquidity</p>
        </Header>
      )}
      <AutoColumn style={{ display: 'block', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 12 }}>
        <div
          style={{
            width: '100%',
            backgroundColor: '#000',
            padding: 8,
            border: '1.5px solid rgba(255, 255, 255, 0.04)',
            borderRadius: 12,
            minHeight: 310
          }}
        >
          {v2.map(v2Pair => (
            <FullPositionCard handlePool={handlePool} key={v2Pair.liquidityToken.address} pair={v2Pair} />
          ))}
          {v2.length === 0 && (
            <div>
              {/* {!hasV1Liquidity &&( */}

              {/* )}
               */}
              <Placeholder />
            </div>
          )}
        </div>

        <RowBetween style={{ justifyContent: 'center', minHeight: 66 }}>
          <p style={{ maxWidth: 375, fontSize: 12, fontWeight: 400 }}>Don't see Your Liquidity Pool you joined?</p>

          <ImportLink
            onClick={() => {
              setModalView(!modalView)
            }}
          >
            <p
              style={{
                color: '#756FDA',
                position: 'relative'
              }}
            >
              &nbsp; Import it.
            </p>
          </ImportLink>
        </RowBetween>
      </AutoColumn>
      {/* {hasV1Liquidity ? (
        <span style={{ fontSize: 16, fontWeight: 600 }}>SPHRI V1 liquidity found!</span>
      ) : (
        v2.length !== 0 && (
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              display: 'flow-root',
              marginTop: 26
            }}
          >
            Don't see a pool you joined?
          </span>
        )
      )}{' '} */}
      {/* {hasV1Liquidity ? (
        <ImportBtn>Migrate Now</ImportBtn>
      ) : (
        <ImportBtn onClick={() => showFinder()}> Import it</ImportBtn>
      )} */}
      {hasV1Liquidity ? (
        <>
          <StyledInternalLink style={{ color: '#2E37F2' }} id="import-pool-link" to={'/migrate/v1'}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#2E37F2' }}>Migrate now.</span>
          </StyledInternalLink>
        </>
      ) : null

      // v2.length !== 0 && (
      //   <>
      //     <ImportLink onClick={() => setModalView(!modalView)}>
      //       <span style={{ fontSize: 16, fontWeight: 600, color: '#2E37F2' }}>Import it.</span>
      //     </ImportLink>
      //   </>
      }
      {modalView === true ? (
        <>
          <Modal isOpen={modalView} onDismiss={() => setModalView(false)}>
            <div style={{ display: 'block', width: '100%', height: 'fit-content' }}>
              <HeaderRow>
                <Text fontWeight={500} fontSize={24}>
                  Import Pool
                </Text>
                <CloseIcon onClick={() => setModalView(false)}>
                  <CloseColor />
                </CloseIcon>
              </HeaderRow>

              <PoolFinder onButtonClick={() => setModalView(false)} />
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </ImportsWrapper>
  )
}

export default Imports

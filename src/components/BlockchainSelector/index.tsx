import { ChevronDown, Repeat, Link } from 'react-feather'
import { useActiveWeb3React } from '../../hooks'
import { addBscMainnetNetwork } from '../../pages/App'
import { addEthNetwork } from '../Header/headertoggle'
import BlockchainLogo from '../BlockchainLogo'
import { CrosschainChain } from '../../state/crosschain/actions'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import Arrow from '../../assets/images/double-arrow.svg'
import { RowBetween } from 'components/Row'
import useWindowDimensions from 'hooks/useWindowDimensions'

const Container = styled.div`
  //border: 1px dashed rgba(38, 98, 255, 0.5);
  //border-radius: 14px;
  //margin-bottom: 1.5rem;
  //margin-top: 0.5rem;
  //display: flex;
  //flex-direction: column;
  //overflow: hidden;
  display: flex;
  width: 100%;
  justify-content: start;
  h5 {
    margin-left: 0.3rem;
  }
  p {
    //margin-left: auto;
    padding: 1rem 2rem;
    border-radius: 12px;
    background: rgba(38, 98, 255, 0.25);
    box-shadow: 0 3px 10px #2e4c93;
    transition: all 0.2s ease-in-out;
    font-size: 18px;
    span {
      margin-left: 4px;
      margin-right: 4px;
    }
    &:hover {
      background: rgba(38, 98, 255, 0.75);
      cursor: pointer;
    }
    &.crosschain {
      //margin: auto;
    }
    &.currentchain {
      background: transparent;
      box-shadow: 0 3px 10px #2e4c93;
    }
  }
`
const ArrowWrapper = styled.div`
  display: flex;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
  transform: rotate(90deg);
`};
`
const Wrapper = styled.div`
  padding: 11px 11.1px 7px 10.3px;
  background-color: #22386c;
  border-radius: 35px;
  box-shadow: 0 3px 10px #22386c;
  border: 1px solid rgba(204, 204, 204, 0.3);
`

const Row = styled.div<{ borderBottom: boolean; isCrossChain?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  border-bottom: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: flex;
`};
`
const ChainRow = styled(RowBetween)`
  justify-content: center;
  width: 100%;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 24px 8px 6px;
  background: linear-gradient(89.59deg, #85a2bd 0.51%, #aebd84 104.04%);
  border-radius: 70px;
  height: 30px;
`

const BlockchainSelector = ({
  blockchain,
  transferTo,
  supportedChains,
  isCrossChain,
  onShowCrossChainModal,
  onShowTransferChainModal
}: {
  blockchain: string | CrosschainChain | undefined
  transferTo: any // tslint not working here, same as above
  isCrossChain?: boolean
  supportedChains: string[]
  onShowCrossChainModal: () => void
  onShowTransferChainModal: () => void
}) => {
  const { width } = useWindowDimensions()


  const openChangeChainInfo = () => {
    onShowCrossChainModal()
  }

  const { chainId, account } = useActiveWeb3React()

  const openTransferModal = () => {
    onShowTransferChainModal()
  }

  if (!blockchain) {
    return <div />
  }
  // @ts-ignore
  return (
    <Container>
      {!isCrossChain && (
        <Row borderBottom={false} isCrossChain={isCrossChain}>
          <Link size={16} />
          <h5>Blockchain:</h5>
          <p onClick={openChangeChainInfo}>
            <BlockchainLogo
              size="18px"
              blockchain={typeof blockchain === 'string' ? blockchain : ''}
            />
            <span>{blockchain}</span>

            <ChevronDown size="18"  />
          </p>
        </Row>
      )}
      {isCrossChain && (
        <Row
          borderBottom={false}
          isCrossChain={isCrossChain}
          style={{ display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 20, alignItems: 'baseline', height: width < 500 ? 57 : '' }}
        >
          {/* <ChainRow className="crosschain currentchain">
            <BlockchainLogo
              size="36px"
              blockchain={typeof blockchain !== 'string' ? blockchain.name : blockchain}
              style={{ marginBottom: '-3px' }}
            />
            <div style={{ display: 'grid', textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>From</span>
              {account ? (
                <>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {typeof blockchain !== 'string' ? blockchain.name : blockchain}
                  </span>
                </>
              ) : (
                ''
              )}
            </div>
            <ChevronDown size="18" style={{ marginBottom: '-3px' }} />
          </ChainRow>*/}

          {/* {(chainId === 56 || chainId === 97) && (
            <div style={{ cursor: 'pointer', textAlign: 'center' }} onClick={addEthNetwork}>
              <img src={Arrow} alt={'arrow'} />
            </div>
          )}
          {chainId !== 56 && chainId !== 97 && (
            <div style={{ cursor: 'pointer', textAlign: 'center' }} onClick={addBscMainnetNetwork}>
              <img src={Arrow} alt={'arrow'} />
            </div>
          )}  */}

          {/* <p className="crosschain" onClick={openTransferModal}> */}
          <span style={{ fontSize: 14, fontWeight: 500, opacity: 0.6, width: '100%' }}>To</span>

          <ChainRow
            className="crosschain"
            onClick={openTransferModal}
            style={{ justifyContent: 'center',  gap: 10, display: 'flex'  }}
          >
            <BlockchainLogo
              size="36px"
              blockchain={typeof transferTo !== 'string' ? transferTo?.name : ''}
              
            />

            <div style={{ display: 'grid', textAlign: 'center'}}>
              {account ? (
                <>
                  <span style={{ color: '#000', fontSize: width < 500? 10 : 14, fontWeight: 500 }}>
                  {transferTo && transferTo.name.length > 0 ? transferTo.name : 'Select a chain'}
                  </span>
                </>
              ) : (
                ''
              )}
            </div>
            <ChevronDown size="18"  />
          </ChainRow>
        </Row>
      )}
    </Container>
  )
}

export default BlockchainSelector

import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { useCrosschainState } from 'state/crosschain/hooks'
import { TYPE } from 'theme'

const defaultToken: { [key: number]: string } = {
  56: 'BNB',
  97: 'BNB',
  1: 'ETH',
  42161: 'ETH',
  137: 'MATIC',
  43114: 'AVAX'
}
const GasFeeCard = () => {
  const { targetChain, transferAmount, crosschainFee, currentToken } = useCrosschainState()
  const { account, chainId } = useActiveWeb3React()
  return (
    <>
      {targetChain && transferAmount && account && chainId && (
        <AutoColumn
          style={{
            display: 'flex',
            padding: '24px 14px',
            minHeight: 68
          }}
        >
          <>
            <RowBetween style={{ justifyContent: 'space-between', padding: '0px 20px', opacity: 0.6 }}>
              <RowFixed>
                <TYPE.white fontSize={14} fontWeight={500}>
                  Bridge Gas Fee:
                </TYPE.white>
              </RowFixed>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {parseFloat(crosschainFee).toFixed(10)} {defaultToken[chainId] ?? currentToken.symbol}
              </span>
            </RowBetween>
          </>
        </AutoColumn>
      )}
    </>
  )
}

export default GasFeeCard

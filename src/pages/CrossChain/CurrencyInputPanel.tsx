import { Currency, Pair } from '@spherium/swap-sdk'
import React, { useContext, useState, useCallback, useEffect } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../../components/SearchModal/XCHAINCurrencySearchModal'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import BlockchainSearchModal from '../../components/SearchModal/BlockchainSearchModal'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { CHAIN_LABELS, returnBalanceNum } from '../../constants'
import DropDown from '../../assets/images/dropdown.png'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import Dollarcoin from '../../assets/images/dollarcoin.svg'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { ChevronDown } from 'react-feather'
import BlockchainLogo from 'components/BlockchainLogo'
import { useCrosschainState } from 'state/crosschain/hooks'
import axios from 'axios'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 4px;
  //padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  //background: #F4F6FA;
  border-radius: 4px;



// :focus-within {
//   border: 1px solid rgba(0, 0, 0, 0.13);
// }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 0px;
  margin-bottom: 20px;
  `};

`
const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: baseline;
`

const CurrencySelect = styled.button<{ selected: boolean; chainId: number | undefined }>`
  align-items: baseline;
  //margin-bottom: 20px;
  height: 2rem;
  //width: 165px;
  display: flex;
  font-size: 16px;
  font-weight: 600;
  background-color: transparent;
  color: ${({ selected }) => (selected ? 'black' : '#39404e')};
  border-radius: 20px;
  //box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0;



  ${({ theme }) => theme.mediaWidth.upToSmall`
  //width: 154px;
  padding: 0rem;
  margin-right: 5px;
`};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  justify-content: space-between;
  width: 100%;
  //padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
  }
`

const Aligner = styled.span`
  display: flow-root;
  align-items: center;
  justify-content: space-between;
` // height: 48px

const StyledDropDown = styled.datalist<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 45%;
  width: ${({ selected }) => (selected ? '10px' : '')};

  path {
    stroke: #39404e;
    stroke-width: 2.5px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 0 0.25rem 0 0rem;
`};
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};

  background-color: transparent;
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: transparent;
  margin: 24px;
  margin-top: 26px;
  margin-bottom: 0px;
  min-height: 55px;
  height: 100%;
  //margin: 18px 100px 5px 140px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    
//border-top: 1px solid rgba(255, 255, 255, 0.06);
border-radius:0px;

`};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  font-weight: 500;
  margin-right: 10px;
  font-size: 15px;
  padding: ${({ active }) => (active ? '0px' : '2px 14px')};
  background: ${({ active }) => (active ? 'transparent' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 18px;
  margin-right: 10px;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
font-size: 14px;
margin-right: 10px;
`};
`

const BlockchainSelect = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 24px 8px 6px;
  background: linear-gradient(89.59deg, #85a2bd 0.51%, #aebd84 104.04%);
  border-radius: 70px;
  height: 30px;

  color: ${({ theme }) => theme.black};
  cursor: pointer;
  user-select: none;
  border: none;
`

const StyledBalanceMax = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  font-size: 12px;
  padding: 5px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  opacity: 0.5;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-bottom: 0.6rem;

  `};
`
const MobileWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
    flex-direction: row;

`};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  blockchain?: string
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  onBlockchainSelect?: (blockchain: Currency) => void
  currency?: Currency
  disableCurrencySelect?: boolean
  disableBlockchainSelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  isCrossChain?: boolean
  crossChainBalance?: string
  currentTargetToken?: any
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  onBlockchainSelect,
  currency,
  blockchain,
  disableCurrencySelect = false,
  disableBlockchainSelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  isCrossChain,
  crossChainBalance,
  currentTargetToken
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const [modal2Open, setModal2Open] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined, chainId)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const hasABalance = !!(selectedCurrencyBalance && parseFloat(selectedCurrencyBalance.toSignificant(6)) > 1 / 10e18)
  const { width } = useWindowDimensions()
  const { currentBalance } = useCrosschainState()
  const [balanceinEther, setBalanceinEther] = useState<any>()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
    }
  }

  const info = {
    chain: chainId === 56 ? 'BSC' : 'ETH',
    network: 'mainnet',
    walletAddress: account
  }

  const getCurrencyValues = async () => {
    try {
      const { data } = await axios.post('https://app.spherium.finance/api/v1/wallet/balance', info, config)
      return setBalanceinEther(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getCurrencyValues()
  }, [currency])

  const getRightCurrency = (curr: any) => {
    if (chainId === 1) {
      if (curr?.name === 'SPHRI') {
        return balanceinEther && Number(balanceinEther[0]?.balanceInEther).toFixed(4)
      }
      if (curr?.name === 'BACKED') {
        return balanceinEther && Number(balanceinEther[1]?.balanceInEther).toFixed(4)
      }
    } else if (chainId === 56) {
      if (curr?.name === 'Spherium') {
        return balanceinEther && Number(balanceinEther[0]?.balanceInEther).toFixed(4)
      }
      if (curr?.name === 'BACKED') {
        return balanceinEther && Number(balanceinEther[1]?.balanceInEther).toFixed(4)
      }
    }

    return ''
  }

  return (
    <>
      <InputPanel id={id}>
        <Container hideInput={hideInput}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              paddingBottom: 23,
              borderBottom: '1.5px solid rgba(255, 255, 255, 0.1)',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'grid', gap: 10 }}>
              <TYPE.body color={'#fff'} fontWeight={500} fontSize={12} width={'95%'} textAlign={'left'} opacity={0.6}>
                {label}
              </TYPE.body>
              <BlockchainSelect
                selected={!!blockchain}
                className="open-blockchain-select-button"
                onClick={() => {
                  if (!disableBlockchainSelect) {
                    setModal2Open(true)
                  }
                }}
              >
                <Aligner style={{ display: 'flex', gap: 10 }}>
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={14} margin={true} />
                  ) : blockchain ? (
                    <BlockchainLogo blockchain={blockchain} size={'14px'} />
                  ) : null}
                  <span style={{ fontWeight: 500 }}>{' ' + blockchain}</span>

                  {/* {!disableCurrencySelect && <StyledDropDown selected={!!currency} />} */}
                </Aligner>
              </BlockchainSelect>
            </div>
            <div style={{ display: 'flex' }}>
              {currency ? (
                <CurrencyLogo
                  currency={currency}
                  style={{ width: 35, height: 35, marginRight: width < 500 ? 0 : 10, position: 'relative', top: 5 }}
                />
              ) : (
                <img
                  src={Dollarcoin}
                  width={35}
                  height={35}
                  style={{ marginRight: width < 500 ? 0 : 10, position: 'relative', top: 5 }}
                />
              )}
              {!hideInput && (
                <LabelRow>
                  <div style={{ display: 'grid', width: '100%' }}>
                    <RowBetween style={{ display: 'block' }}>
                      <MobileWrapper>
                        <div
                          style={{
                            width: '100%',
                            flexDirection: 'row-reverse',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: width < 500 ? 'end' : 'flex-start',
                              width: '100%'
                            }}
                          >
                            <CurrencySelect
                              chainId={chainId}
                              style={{
                                opacity: `${isCrossChain && label === 'Transfer To ' && !currency?.symbol ? '0' : '1'}`
                              }}
                              selected={!!currency}
                              className="open-currency-select-button"
                              onClick={() => {
                                if (!disableCurrencySelect) {
                                  setModalOpen(true)
                                }
                              }}
                            >
                              <Aligner>
                                {pair
                                  ? ''
                                  : // <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                                  currency
                                  ? ''
                                  : // <CurrencyLogo currency={currency} size={'24px'} />
                                    null}
                                {pair ? (
                                  <StyledTokenName className="pair-name-container">
                                    {pair?.token0.symbol}:{pair?.token1.symbol}
                                  </StyledTokenName>
                                ) : (
                                  <StyledTokenName
                                    className="token-symbol-container"
                                    active={Boolean(currency && currency.symbol)}
                                  >
                                    {isCrossChain && label === 'To'
                                      ? `${currentTargetToken?.symbol ? currentTargetToken?.symbol : '-'}`
                                      : (currency && currency.symbol && currency.symbol.length > 20
                                          ? currency.symbol.slice(0, 4) +
                                            '...' +
                                            currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                                          : currency?.symbol) || t('Select Asset')}
                                  </StyledTokenName>
                                )}
                                {!disableCurrencySelect && !disableBlockchainSelect && (
                                  <ChevronDown
                                    size="18"
                                    style={{ marginBottom: '-3px' }}
                                    color="rgba(255, 255, 255, 0.34)"
                                  />
                                )}
                                {account && (
                                  <TYPE.body
                                    onClick={hasABalance ? onMax : () => {}}
                                    fontWeight={500}
                                    color={'#fff'}
                                    style={{
                                      display: 'flex',
                                      cursor: 'pointer',
                                      justifyContent: 'flex-start',
                                      fontSize: 12
                                    }}
                                  >
                                    <p style={{ justifyContent: 'flex-start', margin: 'auto' }}>
                                      {(customBalanceText ?? 'Wallet Bal  ') +
                                        `${
                                          selectedCurrencyBalance
                                            ? selectedCurrencyBalance?.toFixed(2)
                                            : chainId !== 1 && chainId !== 56
                                            ? currentBalance || '0.00'
                                            : getRightCurrency(currency) || '0.00'
                                        }`}
                                    </p>
                                  </TYPE.body>
                                )}
                              </Aligner>
                            </CurrencySelect>
                          </div>
                        </div>
                      </MobileWrapper>
                    </RowBetween>
                  </div>
                </LabelRow>
              )}
            </div>
          </div>
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <InputWrapper>
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={val => {
                    onUserInput(val)
                  }}
                />
                {account && currentBalance && showMaxButton && label !== 'To' && (
                  <StyledBalanceMax onClick={onMax}>
                    <span style={{ padding: 5 }}>MAX</span>
                  </StyledBalanceMax>
                )}
              </InputWrapper>
            )}
          </InputRow>
        </Container>
        {!disableCurrencySelect && onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={!isCrossChain}
            isCrossChain={isCrossChain}
          />
        )}
        {!disableBlockchainSelect && onBlockchainSelect && (
          <BlockchainSearchModal
            isOpen={modal2Open}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onBlockchainSelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={showCommonBases}
          />
        )}
      </InputPanel>
    </>
  )
}

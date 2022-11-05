import { Currency, Pair } from '@spherium/swap-sdk'
import React, { useContext, useState, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import BlockchainSearchModal from '../../components/SearchModal/BlockchainSearchModal'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import Dollarcoin from '../../assets/images/dollarcoin.svg'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { ChevronDown } from 'react-feather'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 4px;
  //padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  //background-color: #f4f6fa;


:focus-within {
  border-image: linear-gradient(to right, #65B6D0, #884DD3);
  border-image-slice: 1;
}

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
  margin-bottom: 16px;
  height: 2rem;
  width: 165px;
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
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
` // height: 48px

// const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
//   margin: 0 0.25rem 0 0.5rem;
//   height: 45%;
//   width: ${({ selected }) => (selected ? '10px' : '')};

//   path {
//     stroke: #39404e;
//     stroke-width: 2.5px;
//   }

//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   margin: 0 0.25rem 0 0rem;
// `};
// `

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
  margin-top: 0px;
  margin-bottom: 0px;
  min-height: 55px;
  height: 100%;
  //margin: 18px 100px 5px 140px;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  font-weight: 500;
  margin-right: 10px;
  background: ${({ active }) => (active ? 'transparent' : 'rgba(255, 255, 255, 0.2)')};
  padding: ${({ active }) => (active ? '0px' : '2px 14px')};
  border-radius: 6px;
  font-size: 14px;
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

  const { width } = useWindowDimensions()

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            paddingTop: 32,
            borderBottom: '1.5px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {currency ? (
            <CurrencyLogo
              currency={currency}
              style={{ width: 40, height: 40, marginBottom: width < 500 ? '24px' : '1.8rem', marginRight: 10 }}
            />
          ) : (
            <img
              src={Dollarcoin}
              width={40}
              height={40}
              style={{ marginBottom: width < 500 ? '24px' : '1.8rem', marginRight: 10 }}
            />
          )}
          <div style={{ display: 'grid', width: '100%' }}>
            {!hideInput && (
              <LabelRow>
                <RowBetween style={{ justifyContent: 'flex-start' }}>
                  <TYPE.body
                    color={'#fff'}
                    fontWeight={500}
                    fontSize={12}
                    width={'95%'}
                    textAlign={'left'}
                    opacity={0.6}
                  >
                    {label}
                  </TYPE.body>
                  {account && (
                    <TYPE.body
                      onClick={onMax}
                      color={'#fff'}
                      fontWeight={500}
                      fontSize={12}
                      style={{
                        display: 'grid',
                        cursor: 'pointer',
                        justifyContent: 'flex-end',
                        textAlign: 'end',
                        width: '100%',
                        height: 20
                      }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance ? (
                        <>
                          <span style={{ opacity: 0.6 }}>{customBalanceText ?? ' Wallet bal: '}</span>
                          <span style={{ fontSize: 14, fontWeight: 500, opacity: 1 }}>
                            {selectedCurrencyBalance?.toSignificant(6)}
                          </span>
                        </>
                      ) : (
                        ' -'
                      )}
                    </TYPE.body>
                  )}
                </RowBetween>
              </LabelRow>
            )}
            <CurrencySelect
              chainId={chainId}
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
                  <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || t('Select Asset')}
                  </StyledTokenName>
                )}
                {!disableCurrencySelect && (
                  <ChevronDown size="18" style={{ marginBottom: '-3px' }} color="rgba(255, 255, 255, 0.34)" />
                )}
              </Aligner>
            </CurrencySelect>
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
              {account && currency && showMaxButton && label !== ' Swap To ' && (
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
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}

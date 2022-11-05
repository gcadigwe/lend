import React from 'react'
import { Text } from 'rebass'
import { ChainId, Currency, currencyEquals, ETHER, Token, BNB, MATIC, AVAX } from '@spherium/swap-sdk'
import styled from 'styled-components'

import { SUGGESTED_BASES } from '../../constants'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && '#86898f'};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  return (
    <AutoColumn gap="md" style={{ display: 'block' }}>
      <AutoRow>
        <Text fontWeight={500} fontSize={14} color={'#fff'}>
          Common bases
        </Text>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <AutoRow gap="4px">
        <BaseWrapper
          onClick={() => {
            if (chainId === 97 || chainId === 56) {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, BNB)) {
                onSelect(BNB)
              }
            } else if (chainId === 43114 || chainId === 43113) {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, AVAX)) {
                onSelect(AVAX)
              }
            } else if (chainId === 137 || chainId === 80001) {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, MATIC)) {
                onSelect(MATIC)
              }
            } else if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disable={selectedCurrency === (ETHER || BNB || MATIC || AVAX)}
        >
          <CurrencyLogo
            currency={
              chainId === 97 || chainId === 56
                ? BNB
                : chainId === 137 || chainId === 80001
                ? MATIC
                : chainId === 43113 || chainId === 43114
                ? AVAX
                : ETHER
            }
            style={{ marginRight: 8 }}
          />
          <Text fontWeight={500} fontSize={16} color={'#fff'}>
            {chainId === 97 || chainId === 56
              ? 'BNB'
              : chainId === 137 || chainId === 80001
              ? 'MATIC'
              : chainId === 43113 || chainId === 43114
              ? 'AVAX'
              : 'ETH'}
          </Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text fontWeight={500} fontSize={16} color={'#fff'}>
                {token.symbol}
              </Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}

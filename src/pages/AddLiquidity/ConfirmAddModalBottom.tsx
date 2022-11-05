import { Currency, CurrencyAmount, Fraction, Percent } from '@spherium/swap-sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { AutoColumn } from 'components/Column'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <RowBetween
        style={{
          background: 'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)',
          borderRadius: 8,
          padding: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }}
      >
        <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />

        <RowFixed style={{ display: 'block', marginLeft: 10 }}>
          <TYPE.body width={'100%'} style={{ color: '#828DB0', fontSize: 14, fontWeight: 500 }}>
            Deposited Asset
          </TYPE.body>
          <TYPE.body fontSize={16} fontWeight={500} color={'#fff'}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
            {currencies[Field.CURRENCY_A]?.symbol}
          </TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween
        style={{
          background: 'linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%)',
          borderRadius: 8,
          padding: 10,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}
      >
        <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
        <RowFixed style={{ display: 'block', marginLeft: 10 }}>
          <TYPE.body width={'100%'} style={{ color: '#828DB0', fontSize: 14, fontWeight: 500 }}>
            Deposited Asset
          </TYPE.body>
          <TYPE.body fontSize={16} fontWeight={500} color={'#fff'}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
            {currencies[Field.CURRENCY_B]?.symbol}
          </TYPE.body>
        </RowFixed>
      </RowBetween>

      <AutoColumn
        style={{ gridTemplateColumns: 340, alignItems: 'center', lineHeight: '40px', marginTop: 20, display: 'block' }}
      >
        <RowBetween style={{ justifyContent: 'space-between' }}>
          <TYPE.body width={'60%'} fontSize={16} fontWeight={500} color={'#fff'}>
            Exchange Rate
          </TYPE.body>
          <TYPE.body
            width={'100%'}
            fontSize={16}
            fontWeight={500}
            color={'#fff'}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <TYPE.body
            fontSize={16}
            fontWeight={500}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            color={'#fff'}
          >
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'space-between' }}>
          <TYPE.body fontSize={16} fontWeight={500} color={'#fff'}>
            Share of Pool:
          </TYPE.body>
          <TYPE.body fontSize={16} fontWeight={500} color={'#fff'}>
            {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
          </TYPE.body>
        </RowBetween>
      </AutoColumn>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
        </Text>
      </ButtonPrimary>
    </>
  )
}

import { Percent } from '@spherium/swap-sdk'
import useWindowDimensions from 'hooks/useWindowDimensions'
import React from 'react'
import { ONE_BIPS } from '../../constants'
import { warningSeverity } from '../../utils/prices'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  const { width } = useWindowDimensions()

  return (
    <ErrorText fontWeight={500} fontSize={ width < 500 ? 12 : 14} severity={warningSeverity(priceImpact)}>
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}

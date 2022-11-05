import React from 'react'
import USDLogo from '../../assets/svg/usd_logo.svg'
import SpheriumLogo from '../../assets/svg/sphri_logo.svg'
import styled from 'styled-components'
import { Currency } from './config'
import CryptoIcon from 'components/utils/CryptoIcon'
import WyreCoinMap from './wyreMap.json'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  padding: 6px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.49);
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.49);
`

const CurrenciesList = styled.div`
  height: calc(100vh - 100px);
  overflow: auto;
`
const CurrencyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  height: 40px;
  margin-bottom: 5px;
  cursor: pointer;

  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  & .symbol {
    font-weight: 600;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.9);
    margin-left: 13px;
  }

  .logo {
    border-radius: 50%;
    width: 31px;
    height: 31px;
    border-radius: 50%;
    object-fit: cover;
  }

  & .name {
    font-weight: 600;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: capitalize;
  }
`

const NoResultFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: #f84b6a;
  height: 500px;
`

type Props = {
  currencies: any[]
  targetCurrency: Currency | null
  srcCurrency: Currency | null
  onUpdate(c: Currency): void
}

const Currencies: React.FC<Props> = ({ currencies, onUpdate, srcCurrency, targetCurrency }) => {
  //@ts-ignore
  const supportedTargetPairs = new Set(WyreCoinMap.supportedExchangePairs[srcCurrency?.ticker])
  // @ts-ignore
  const supportedSrcPairs = new Set(WyreCoinMap.supportedExchangePairs[targetCurrency?.ticker])
  return (
    <div>
      {currencies.length > 0 ? (
        <div>
          <Header>
            <p>Symbol</p>
            <p>Currency</p>
          </Header>
          <CurrenciesList>
            {currencies.map(c => {
              if (c.digitalCurrency && srcCurrency && !supportedTargetPairs.has(c.ticker)) return

              if (!c.digitalCurrency && targetCurrency && !supportedSrcPairs.has(c.ticker)) return
              return (
                <CurrencyItem onClick={() => onUpdate(c)} key={c.name}>
                  <div>
                    {c.digitalCurrency ? (
                      <CryptoIcon name={c.ticker} />
                    ) : (
                      <img className="logo" src={c.flag ? 'data:image/jpeg;base64,' + c.flag : USDLogo} alt={c.name} />
                    )}
                    <p className="symbol">{c.ticker}</p>
                  </div>

                  <p className="name">{c.name}</p>
                </CurrencyItem>
              )
            })}
          </CurrenciesList>
        </div>
      ) : (
        <NoResultFound>No Result Found</NoResultFound>
      )}
    </div>
  )
}

export default Currencies

export const SRC_CURRENCIES = [
  {
    logo: USDLogo,
    symbol: 'USD',
    name: 'United State Dollar'
  },
  {
    logo: SpheriumLogo,
    symbol: 'USD',
    name: 'United State Dollar'
  },
  {
    logo: USDLogo,
    symbol: 'USD',
    name: 'United State Dollar'
  }
]

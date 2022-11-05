import React from 'react'
import styled from 'styled-components'
import { Currency, WYER_CONFIG } from './config'
import allCountries from './countries.json'

const Header = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.49);
  padding: 6px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.49);
  margin-bottom: 15px;
`

const CountriesList = styled.div`
  height: calc(100vh - 200px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px !important;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: auto !important;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: #90a4ae;
    border-radius: 7px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background-color: auto !important;
  }
`
const CountryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 4px;
  height: 40px;
  margin-bottom: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 13px;
  text-transform: capitalize;

  .flag {
    margin-right: 13px;
    border-radius: 50%;
    display: inline-block;
    width: 31px;
    height: 31px;
    object-fit: cover;
  }

  .name {
    margin-right: 1px;
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
  countries: any[]
  onUpdate(c: Currency): void
}

const Countries: React.FC<Props> = ({ countries, onUpdate }) => {
  return (
    <div>
      {countries.length > 0 ? (
        <div>
          <Header>
            <p>Country Name</p>
          </Header>

          <CountriesList>
            {countries.map(c => (
              <CountryItem onClick={() => onUpdate(c)} key={c.name}>
                <img className="flag" src={'data:image/jpeg;base64,' + c.flag} alt={c.name} />
                <p className="name">{c.name}</p>
              </CountryItem>
            ))}
          </CountriesList>
        </div>
      ) : (
        <NoResultFound>No Result Found</NoResultFound>
      )}
    </div>
  )
}

export default Countries

export const getSupportedCountries = () => {
  const supportedCountriesString =
    'Algeria, Argentina , Australia, Austria, Belgium , Bolivia, Brazil, Canada, Chile, Colombia, Costa Rica, Cyprus, Czech Republic, Denmark, Dominican Republic, Estonia, Finland, France, France, Germany, Great Britain, Greece, Hong Kong, Iceland, India, Indonesia, Ireland, Italy, Japan, Laos, Latvia, Lithuania, Luxembourg, Malaysia, Mexico, Nepal, New Zealand, Norway, Paraguay, Peru, Philippines, Poland, Portugal, Singapore, Slovakia, Slovenia,South Africa,South Korea,Spain,Sweden,Switzerland,Tanzania,Thailand,The Netherlands,Turkey,Vietnam, United Kingdom'

  const supportedCountries = new Set(supportedCountriesString.split(',').map(c => c.trim().toLocaleLowerCase()))
  return allCountries
    .filter(c => supportedCountries.has(c.name.toLocaleLowerCase()))
    .map(c => ({
      isoAlpha2: c.isoAlpha2,
      name: c.name,
      flag: c.flag
    }))
}

const getCurrencyMap = () => {
  const currencies: any = {}

  for (const c of allCountries) {
    currencies[c.currency.code.toLocaleLowerCase()] = c.flag
  }

  return currencies
}

export const getSrcCurrencies = () => {
  const currencyToFlag = getCurrencyMap()
  const srcCurrencies = WYER_CONFIG.currencies
    .filter(c => !c.digitalCurrency)
    .map(c => ({
      ...c,
      flag: currencyToFlag[c.ticker.toLocaleLowerCase()]
    }))

  return srcCurrencies
}

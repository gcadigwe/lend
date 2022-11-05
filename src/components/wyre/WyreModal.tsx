import React, { useState } from 'react'
import { useWyreModalToggle } from 'state/application/hooks'
import styled from 'styled-components'
import Modal from '../Modal'
import { X } from 'react-feather'
import SpheriumLogo from '../../assets/images/logo-white.svg'
import USDLogo from '../../assets/svg/usd_logo.svg'
import ChevronDownBlack from '../../assets/svg/chevronDownBalck.svg'
import ArrowRight from '../../assets/svg/arrow_right.svg'
import ArrowLeft from '../../assets/svg/arrow_left.svg'
import ApplePay from '../../assets/svg/apple_pay.svg'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import axios from 'axios'
import { Spinner } from 'components/Header/Polling'
import Currencies from './Currencies'
import { WYER_CONFIG, Currency, ChainItem } from './config'
import chevronDown from '../../assets/svg/chevronDown.svg'
import Countries, { getSrcCurrencies, getSupportedCountries } from './Countries'
import ChainsList from './Chains'
import CryptoIcon from 'components/utils/CryptoIcon'
import WyreCoinMap from './wyreMap.json'

const CloseIcon = styled.div`
  text-align: right;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
const CloseColor = styled(X)`
  path {
    stroke: ${({ theme }) => theme.text2};
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  & > p {
    font-family: 'Archivo';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
  }

  & > img {
    width: 108px;
  }
`

const Amount = styled.div<{ width: number }>`
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;

  & > .amountPanel {
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 32px;
    text-align: center;
    color: #ffffff;
    background: #121317;
    border-radius: 8px;

    .amountInput {
      border: none;
      outline: none;
      color: #ffffff;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      width: ${({ width }) => Math.max(width * 24, 60) + 'px'};
      background: #121317;

      &::placeholder {
        color: rgba(255, 255, 255, 0.13);
      }
    }

    .text {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: #ffffff;
    }
  }

  & > .currencyPanel {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #35373c;
    border-radius: 0px 0px 8px 8px;

    .arrowRight {
      margin: 0px 14px;
    }

    .currency {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(89.59deg, #85a2bd 0.51%, #aebd84 104.04%);
      outline: none;
      border: none;
      cursor: pointer;
      border-radius: 30px;
      padding: 4px 8px;
      height: 32px;

      & > img {
        margin-right: 7px;
        width: 25px;
        height: 25px;
        object-fit: cover;
        border-radius: 50%;
      }

      & > p {
        font-family: 'Manrope';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        min-width: 30px;
        text-align: center;
        color: #2a324a;
      }
    }
  }
`

const WalletAddress = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;

  & > label {
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    margin-bottom: 12px;
  }

  & > input {
    background: #0e1218;
    color: #ffffff;
    border-radius: 8px;
    height: 56px;
    border: none;
    outline: none;
    padding: 0px 18px;
  }
`

const PaymentMethod = styled.section`
  margin-top: 15px;
  .label {
    font-weight: 600;
    font-size: 16px;
    color: #616c8e;
  }

  .methods {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
`

const ErrorMessage = styled.div`
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: #f84b6a;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MethodButton = styled.button<{ isActive: boolean }>`
  cursor: pointer;
  background: ${({ isActive }) =>
    isActive
      ? 'linear-gradient(89.59deg, rgba(133, 162, 189, 0.3) 0.51%, rgba(174, 189, 132, 0.3) 104.04%)'
      : 'rgba(255, 255, 255, 0.09)'};
  border: 1px solid ${({ isActive }) => (isActive ? 'rgba(174, 189, 132, 0.3)' : 'rgba(255, 255, 255, 0.11)')};
  box-sizing: border-box;
  border-radius: 8px;
  color: #ffffff;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;

  & > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .apple {
    display: inline-block;
    height: 18px;
  }
`

const Button = styled(ButtonLight)`
  align-self: flex-end;

  & > div {
    width: 32px !important;
    height: 32px !important;
  }
`

const Input = styled.input`
  background: rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  height: 56px;
  border: none;
  outline: none;
  padding: 0px 18px;
  width: 100%;
  color: #ffffff;
`
const DropdownItem = styled.div<{ margin?: string }>`
  border-radius: 8px;
  height: 56px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  outline: none;
  padding: 0px 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ margin }) => margin || '0px'};
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
`

const CurrencyViewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & > h1 {
    font-weight: 700;
    font-size: 24px;
    color: #ffffff;
    width: 100%;
    text-align: center;
  }

  .back {
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;
  }
`

const ContentWrapper = styled.div`
  padding: 10px 25px;
  /* width: 100%; */
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
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

type Props = {
  isOpen: boolean
}

enum PaymentMethods {
  applePay = 'apple-pay',
  creditCard = 'debit-card'
}

enum CurrentView {
  MAIN = 0,
  SRC_CURRENCY = 1,
  TARGET_CURRENCY = 2,
  COUNTERY = 3,
  COUNTRY = 4,
  CHAIN = 5
}
const srcCurrencies = getSrcCurrencies()

const supportedCountries = getSupportedCountries()

const TOKENS = {
  prod: {
    API_TOKEN: 'SK-MPHAE7Z9-A7JULRPN-MHGTNZ3F-DAWUX94L',
    ACCOUNT_ID: 'AC_PT6M84XCNVL',
    WYRE_URL: 'https://api.sendwyre.com/v3/orders/reserve'
  },
  test: {
    API_TOKEN: 'SK-8AJE7VVZ-T6QDWZW6-2V6XTMMW-RWPCPEBH',
    ACCOUNT_ID: 'AC_ZEC8DVC6GRT',
    WYRE_URL: 'https://api.testwyre.com/v3/orders/reserve'
  }
}
const WyreModal: React.FC<Props> = ({ isOpen }) => {
  const toggleWyreModal = useWyreModalToggle()
  const [view, setView] = useState<CurrentView>(CurrentView.MAIN)
  const [srcCurrency, setSrcCurrency] = useState<Currency | null>(null)
  const [targetCurrency, setTargetCurrency] = useState<Currency | null>(null)
  const [currenciesList, setCurrenciesList] = useState<any>([])
  const [amount, setAmount] = useState<string>('')
  const [country, setCountry] = useState<any>(null)
  const [countries, setCountries] = useState<any>(supportedCountries)
  const [chain, setChain] = useState<ChainItem | null>()
  const [address, setAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>(PaymentMethods.creditCard)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  const onSubmit = async () => {
    const { API_TOKEN, ACCOUNT_ID, WYRE_URL } = TOKENS['prod']
    try {
      setLoading(true)
      setError(null)
      let errorMessage = ''
      // || !amount || !country || !address || !chain || !srcCurrency || !targetCurrency

      if (!amount) {
        errorMessage = 'Amount is required'
      } else if (!srcCurrency) {
        errorMessage = 'Source currency is not selected'
      } else if (!targetCurrency) {
        errorMessage = 'Target currency is not selected'
      } else if (!chain) {
        errorMessage = 'Chain is required'
      } else if (!address) {
        errorMessage = 'Wallet address is required'
      } else if (!country) {
        errorMessage = 'Country is required'
      }

      if (errorMessage) {
        throw new Error(errorMessage)
      }

      if (!chain) throw new Error('Chain is missging!')
      const body = {
        sourceAmount: amount,
        amountIncludeFees: false,
        paymentMethod: paymentMethod,
        sourceCurrency: srcCurrency?.ticker,
        destCurrency: targetCurrency?.ticker,
        dest: `${chain.symbol}:${address}`,
        redirectUrl: 'https://app.spherium.finance/',
        failureRedirectUrl: 'https://app.spherium.finance/',
        referrerAccountId: ACCOUNT_ID,
        country: country.isoAlpha2
      }

      const { data } = await axios.post(WYRE_URL, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })

      setLoading(false)
      window.open(data.url, '_blank')
      toggleWyreModal()
    } catch (error) {
      setLoading(false)
      setError(error.response && error.response.data ? error.response.data.message : error.message)
    }
  }

  const displaySrcCurrencies = () => {
    setCurrenciesList(srcCurrencies)
    setView(CurrentView.SRC_CURRENCY)
  }

  const displayTargetCurrencies = () => {
    const c = WYER_CONFIG.currencies.filter(c => c.digitalCurrency)

    setCurrenciesList(c)
    setView(CurrentView.TARGET_CURRENCY)
  }

  const updateCurrency = (c: Currency) => {
    if (view == CurrentView.SRC_CURRENCY) {
      setSrcCurrency(c)
    } else if (view == CurrentView.TARGET_CURRENCY) {
      setTargetCurrency(c)
    }
    setView(CurrentView.MAIN)
    setChain(null)
    setError(null)
  }

  const searchCurrencies = (keyword: string) => {
    let currencies

    if (view === CurrentView.SRC_CURRENCY) {
      currencies = srcCurrencies
    } else if (view === CurrentView.TARGET_CURRENCY) {
      currencies = WYER_CONFIG.currencies.filter(c => c.digitalCurrency)
    }

    if (!currencies) throw new Error('Invalid view')

    const currenciesCopy = JSON.parse(JSON.stringify(currencies))
    if (!keyword) {
      setCurrenciesList(currenciesCopy)
      return
    }
    const regExp = new RegExp(keyword, 'gi')

    const filteredCurrencies = currenciesCopy.filter((c: Currency) => c.name.match(regExp) || c.ticker.match(regExp))
    setCurrenciesList(filteredCurrencies)
  }

  const searchCountries = (keyword: string) => {
    const countries = supportedCountries

    const countriesCopy = JSON.parse(JSON.stringify(countries))
    if (!keyword) {
      setCountries(countriesCopy)
      return
    }
    const regExp = new RegExp(keyword, 'gi')

    const filteredCountries = countriesCopy.filter((c: Currency) => c.name.match(regExp))

    setCountries(filteredCountries)
  }

  const getContent = () => {
    switch (view) {
      case CurrentView.MAIN:
        return (
          <ContentWrapper>
            <div>
              <CloseIcon onClick={toggleWyreModal}>
                <CloseColor />
              </CloseIcon>

              <Header>
                <p>pto in fiat</p>
                <img src={SpheriumLogo} alt="Wyre" />
              </Header>

              <Amount width={amount.length}>
                <div className="amountPanel">
                  <div className="amount">
                    <span>{srcCurrency ? srcCurrency.symbol : '$'}</span>
                    <input
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                      type="text"
                      value={amount}
                      placeholder="100"
                      className="amountInput"
                    />
                  </div>
                  <p className="text">
                    {srcCurrency ? `Enter balance in ${srcCurrency.ticker}` : 'Choose fiat currency'}
                  </p>
                </div>

                <div className="currencyPanel">
                  <button onClick={displaySrcCurrencies} className="currency">
                    {srcCurrency ? (
                      <img src={'data:image/jpeg;base64,' + srcCurrency.flag} alt={srcCurrency.commonTicker} />
                    ) : (
                      <img src={USDLogo} alt="USd" />
                    )}
                    <p>{srcCurrency ? srcCurrency.ticker : '--'}</p>
                  </button>

                  <img className="arrowRight" src={ArrowRight} alt="Arrow" />
                  <button onClick={displayTargetCurrencies} className="currency">
                    <CryptoIcon name={targetCurrency ? targetCurrency.ticker : 'unselected'} />
                    <p>{targetCurrency ? targetCurrency.ticker : '--'}</p>
                  </button>
                </div>
              </Amount>
              <DropdownItem margin="15px 0px 0px 0px" onClick={() => setView(CurrentView.CHAIN)}>
                <p>{chain ? chain.name : 'Select chain'}</p>
                <img src={chevronDown} alt="Select Chain" />
              </DropdownItem>
              <WalletAddress>
                <label htmlFor="walletAddress">Wallet Address</label>
                <input
                  type="text"
                  id="walletAddress"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Add Wallet Address"
                />
              </WalletAddress>
              <PaymentMethod>
                <p className="label">Payment Method</p>

                <div className="methods">
                  <MethodButton
                    onClick={() => setPaymentMethod(PaymentMethods.creditCard)}
                    isActive={paymentMethod === PaymentMethods.creditCard}
                  >
                    <p>Credit / Debit</p>
                  </MethodButton>

                  <MethodButton
                    onClick={() => setPaymentMethod(PaymentMethods.applePay)}
                    isActive={paymentMethod === PaymentMethods.applePay}
                  >
                    <img className="apple" src={ApplePay} alt="Apple Pay" />
                  </MethodButton>
                </div>
              </PaymentMethod>

              <DropdownItem margin="15px 0px 15px 0px" onClick={() => setView(CurrentView.COUNTRY)}>
                <p>{country ? country.name : 'Select country'}</p>
                <img src={chevronDown} alt="Select country" />
              </DropdownItem>
            </div>
            <ErrorMessage>{error}</ErrorMessage>

            <ButtonPrimary disabled={loading} onClick={onSubmit}>
              {!loading ? 'Proceed to payment' : <Spinner />}
            </ButtonPrimary>
          </ContentWrapper>
        )

      case CurrentView.SRC_CURRENCY:
      case CurrentView.TARGET_CURRENCY:
        return (
          <ContentWrapper>
            <div>
              <CloseIcon onClick={toggleWyreModal}>
                <CloseColor />
              </CloseIcon>

              <CurrencyViewHeader>
                <button onClick={() => setView(CurrentView.MAIN)} className="back">
                  <img src={ArrowLeft} alt="Go Back" />
                </button>
                <h1>Select currency</h1>
              </CurrencyViewHeader>

              <div>
                <Input placeholder="Search name of currency" onChange={e => searchCurrencies(e.target.value)} />
                <Currencies
                  currencies={currenciesList}
                  onUpdate={updateCurrency}
                  srcCurrency={srcCurrency}
                  targetCurrency={targetCurrency}
                />
              </div>
            </div>
          </ContentWrapper>
        )
      case CurrentView.COUNTRY:
        return (
          <ContentWrapper>
            <div>
              <CloseIcon onClick={toggleWyreModal}>
                <CloseColor />
              </CloseIcon>

              <CurrencyViewHeader>
                <button onClick={() => setView(CurrentView.MAIN)} className="back">
                  <img src={ArrowLeft} alt="Go Back" />
                </button>
                <h1>Select country</h1>
              </CurrencyViewHeader>

              <div>
                <Input placeholder="Search name of country" onChange={e => searchCountries(e.target.value)} />
                <Countries
                  countries={countries}
                  onUpdate={c => {
                    setCountry(c)
                    setView(CurrentView.MAIN)
                  }}
                />
              </div>
            </div>
          </ContentWrapper>
        )
      case CurrentView.CHAIN:
        const pairsWithNetwork = WyreCoinMap.supportedExchangePairsWithNetwork.find(
          pair => pair.ticker === targetCurrency?.ticker
        )

        const chainsSet = new Set([pairsWithNetwork?.network, targetCurrency?.network])
        pairsWithNetwork?.supportedCurrencies
          .find(currency => currency.ticker === srcCurrency?.ticker && currency.networks[0] !== 'None')
          ?.networks.forEach(network => {
            chainsSet.add(network)
          })
        console.log(chainsSet)
        const chainsList = WYER_CONFIG.chains.filter(
          chain => chainsSet.has(chain.name) || chain.otherNames?.find(name => chainsSet.has(name))
        )
        return (
          <ContentWrapper>
            <div>
              <CloseIcon onClick={toggleWyreModal}>
                <CloseColor />
              </CloseIcon>

              <CurrencyViewHeader>
                <button onClick={() => setView(CurrentView.MAIN)} className="back">
                  <img src={ArrowLeft} alt="Go Back" />
                </button>
                <h1>Select Chain</h1>
              </CurrencyViewHeader>

              <div>
                <ChainsList
                  chains={chainsList.length == 0 ? WYER_CONFIG.chains : chainsList}
                  onUpdate={c => {
                    setChain(c)
                    setView(CurrentView.MAIN)
                  }}
                />
              </div>
            </div>
          </ContentWrapper>
        )
      default:
        return ''
    }
  }

  return (
    <Modal alignX="flex-end" alignY="strach" isOpen={isOpen} onDismiss={toggleWyreModal}>
      {getContent()}
    </Modal>
  )
}

export default WyreModal

import React, { Children, useState, useEffect } from 'react'
import Web3 from 'web3'
import close from '../../../assets/images/staking/close.png'
import { useSITContract, useUserAccount } from '../../../contracts/hooks'
import Loader from '../loader/Loader'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import useMetamaskConnectionStatus from '../../../contracts/hooks/useMetamaskConnectionStatus'
// import { crossIcon } from '../icons';
import {
  ModalBody,
  ModalContent,
  CardContainer,
  CardBackground,
  CloseIconWrapper,
  HeaderLayout,
  CryptoIconWrapper,
  HeaderText,
  HeaderContent,
  HeaderButtonWrapper,
  APRButton,
  DaysButton,
  WithdrawDepositTabsLayout,
  WithdrawDepositTabsContainer,
  DepositTab,
  WithdrawTab,
  Row3,
  Rightsinglebox,
  RightSideContent1,
  RightSideContent2,
  Leftsinglebox,
  LeftSideContent1,
  LeftSideContent2,
  Duration,
  Stakeduration,
  InnerbuttonWrapper,
  Button,
  Buttoncontain,
  WithDrawBTCInputContainer,
  InputField,
  WithdrawNowButtonWrapper,
  WithDrawNowButton,
  Maxwrapper,
  Maxcontain,
  ClaimButton,
  WithdrwaInfo,
  WithdrwaInfoWrapper,
  MarginStyle,
  WalletBalanceContainer,
  WalletBalanceText
} from './Unstakestyle'
export const UnstakeBTC = (props: any) => {
  const {
    show,
    toggleModal,
    children,
    amount,
    setAmount,
    setShow,
    onClose,
    onNext,
    withDays,
    days,
    setDays,
    setShowPopup
  } = props
  const [loading, setLoading] = useState(false)
  const [currentChainid, setCurrentChainId] = useState(97)
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
  const { account } = useUserAccount()
  // console.log(account)
  const StakeTokenIntialiableInstance = useSITContract()
  const withDrawToken = async (e: any) => {
    try {
      if (amount <= 0) {
        // Error Toaster

        toast.error('Please Enter amount greater than 1')
        return
      }
      if (days === '') {
        toast.error('Please Select Days')
        return
      }
      e.preventDefault()
      setLoading(true)
      console.log('amount', amount)
      const weiAmount = Web3.utils.toWei(amount.toString(), 'ether')
      // const stakeInitializableAddress = process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS
      const reponse = await StakeTokenIntialiableInstance?.methods?.withdraw(weiAmount, days).send({
        from: account
      })
      if (reponse) {
        setLoading(false)
        // Success toaster

        toast.success('Tokens Approved')

        // Close Modal
      }
      console.log(reponse)
    } catch (err) {
      // Error Toaster
      // alert(err.message);
      setLoading(false)
    }
  }
  const [ClaimTime, setclaimTime] = useState(0)

  const [totalEarned, setTotalearned] = useState(0)
  const [Apr, setApr] = useState(0)
  const [ClaimTIme, setClaimTime] = useState()
  const [totalstake, setTotalstake] = useState(0)
  const SIT_CONTRACT =
    currentChainid === 97
      ? process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS
      : process.env.REACT_APP_RINKEBY_STAKE_INITIALIZABLE_ADDRESS
  const StakeInitializableInstance = useSITContract(SIT_CONTRACT)

  const setAprValue = async () => {
    const Value = await StakeInitializableInstance?.methods.poolInfo(days).call()

    console.log(Value, account)
    const Value1: any = account && (await StakeInitializableInstance?.methods.userInfo(account, days).call())
    setTotalearned(Value1.rewardDebt)
    console.log(Value1.rewardDebt)
    const weiAmount: any = Web3.utils.fromWei(Value1.amount.toString(), 'ether')
    const moment = require('moment')
    setTotalstake(weiAmount)

    const formatted = moment(parseInt(Value1?.claimTime)).format('L')

    setclaimTime(formatted)
    setApr(Value[2])

    setApr(Value[2])
  }

  useEffect(() => {
    if (StakeInitializableInstance) {
      setAprValue()
    }
  }, [StakeInitializableInstance, days, account])
  const Claimtoken = async (e: any) => {
    try {
      const withDays = 0
      e.preventDefault()
      setLoading(true)
      console.log('amount', amount)
      const weiAmount = Web3.utils.toWei(amount.toString(), 'ether')
      const reponse = await StakeTokenIntialiableInstance?.methods?.claim(withDays).send({
        from: account
      })
      if (reponse) {
        console.log(reponse)
        setLoading(false)

        toast.success('claim Tokens approved')
        onNext(8)
      }
    } catch (err) {
      setLoading(false)
    }
  }
  const {
    isMetamaskConnected,
    setIsMetamaskConnected
    // showWrongNetworkPrompt,
  } = useMetamaskConnectionStatus()
  const [isDepositTabOpen, setDepositTabOpen] = useState(false)
  const [isWithDrawTabOpen, setWithDrawTabOpen] = useState(false)

  const GreatthanZero = () => {
    try {
      if (!isMetamaskConnected) {
        setShowPopup(true)
        return
      }

      if (amount <= 0) {
        // Error Toaster
        toast.error('Please enter amount greater than 0')

        return
      }
      onNext(6)
    } catch (err) {
      toast.error('err')
    }
  }

  return (
    <>
      <CardBackground show={show} onMouseDown={handleClickOutside}>
        <CardContainer>
          <Loader open={loading} />
          <CloseIconWrapper onClick={() => onClose()}>
            <img height="19px" width="19px" src={close} alt="close" />
          </CloseIconWrapper>
          <HeaderLayout>
            <CryptoIconWrapper>
              <img
                height={38}
                width={38}
                src="https://www.pngfind.com/pngs/m/309-3095695_bitcoin-btc-die-cut-sticker-png-download-cross.png"
                alt=""
              />
            </CryptoIconWrapper>
            <HeaderText>Withdraw BTC</HeaderText>
            <HeaderContent>Stake Asset to earn SPHRI</HeaderContent>
            <HeaderButtonWrapper>
              <div>
                <APRButton>{Apr}% APR</APRButton>
              </div>
            </HeaderButtonWrapper>
          </HeaderLayout>
          <WithdrawDepositTabsLayout>
            <WithdrawDepositTabsContainer>
              <DepositTab
                onClick={() => {
                  onNext(1)
                  setDepositTabOpen(true)
                  setWithDrawTabOpen(false)
                }}
                isDepositTabOpen={isDepositTabOpen}
              >
                <div>Deposit</div>
              </DepositTab>
              <WithdrawTab
                onClick={() => {
                  setDepositTabOpen(false)
                  setWithDrawTabOpen(true)
                }}
                isWithDrawTabOpen={isWithDrawTabOpen}
              >
                Withdraw
              </WithdrawTab>
            </WithdrawDepositTabsContainer>
          </WithdrawDepositTabsLayout>
          <Row3>
            <Rightsinglebox>
              <RightSideContent1>
                {totalstake} {currentChainid === 97 || currentChainid === 4 ? 'BTC' : 'BTC'}{' '}
              </RightSideContent1>
              <RightSideContent2>My total staked</RightSideContent2>
            </Rightsinglebox>

            <Leftsinglebox>
              <LeftSideContent1>
                {totalEarned}
                {currentChainid === 97 || currentChainid === 4 ? 'SPHRI' : 'SPHRI'}
              </LeftSideContent1>
              <LeftSideContent2>Earned</LeftSideContent2>
              {/* <div>
                <ClaimButton onClick={e => Claimtoken(e)}>claim </ClaimButton>
              </div> */}
            </Leftsinglebox>
          </Row3>
          {/* <Duration>
            <Stakeduration>Stake Duration</Stakeduration>

            <InnerbuttonWrapper>
              <Button style={{ backgroundColor: days === 0 ? '#57b491' : '' }} onClick={() => setDays(0)}>
                <Buttoncontain>Flexible</Buttoncontain>
              </Button>
              <Button style={{ backgroundColor: days === 30 ? '#57b491' : '' }} onClick={() => setDays(30)}>
                <Buttoncontain onClick={() => setDays(30)}>30 days</Buttoncontain>
              </Button>
              <Button style={{ backgroundColor: days === 48 ? '#57b491' : '' }} onClick={() => setDays(48)}>
                <Buttoncontain onClick={() => setDays(48)}>48 days</Buttoncontain>
              </Button>
              <Button style={{ backgroundColor: days === 84 ? '#57b491' : '' }} onClick={() => setDays(84)}>
                <Buttoncontain onClick={() => setDays(84)}>84 days </Buttoncontain>
              </Button>
            </InnerbuttonWrapper>
          </Duration> */}

          <WalletBalanceContainer>
            <WalletBalanceText>Enter amount to supply</WalletBalanceText>
            <WalletBalanceText>Wallet bal 0.45345 BTC</WalletBalanceText>
          </WalletBalanceContainer>

          <WithDrawBTCInputContainer>
            <InputField
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <Maxwrapper>
              <Maxcontain>Max</Maxcontain>
            </Maxwrapper>
          </WithDrawBTCInputContainer>

          {/* <MarginStyle>Maturity date : {ClaimTime} UST</MarginStyle> */}
          <MarginStyle>Your earned APY also claimed with your assets</MarginStyle>
          <WithdrawNowButtonWrapper>
            <WithDrawNowButton disabled={loading} onClick={() => GreatthanZero()}>
              {' '}
              {loading ? 'Withdrawing Tokens' : 'Withdraw Now'}
            </WithDrawNowButton>
          </WithdrawNowButtonWrapper>
          {/* <WithdrwaInfoWrapper>
            <WithdrwaInfo>Withdrawals made prior to maturity may result in fines</WithdrwaInfo>
          </WithdrwaInfoWrapper> */}
        </CardContainer>
      </CardBackground>
    </>
  )
}

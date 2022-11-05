import React, { Children, useState } from 'react'
import close from '../../../assets/images/staking/close.png'
import Bthlogo from '../../../assets/images/cards/headerlogo.svg'
import Oval from '../../../assets/images/staking/Oval.svg'
import Vector from '../../../assets/images/staking/Vector.svg'
import { useSITContract, useUserAccount } from '../../../contracts/hooks'
import Web3 from 'web3'
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
  Headlinewrapper,
  Headline,
  Row1wrapper,
  InnerWrapperRow1,
  Leftwrapper,
  Logoicon,
  StakeandBTcwrapper,
  Stakeasset,
  BTCvalue,
  RightWrapper,
  Aprcontainer,
  AprContain,
  Dayswrapper,
  DaysContain,
  InputWrapper,
  InputUpperWrapper,
  Singleinput,
  RightSideContent,
  LeftsideContent,
  BottomSideContainer,
  BottomSideText,
  BottomCenterText,
  Innerwrapper,
  TickandContentwrapper,
  Imglogo,
  Tick,
  StakeContent,
  LowerContent
} from './Claimedstyle'
export const Claimed = (props: any) => {
  const { days,show , toggleModal, children ,setShow,onClose,amount} = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
  const { account } : any = useUserAccount();
  const[ClaimTime,setclaimTime]=useState(0)
  const [loading, setLoading] = useState(false)
  const[totalEarned,setTotalearned]=useState()
  const[Apr,setApr]=useState()
const[ClaimTIme,setClaimTime]=useState()
const[totalstake,setTotalstake]=useState(0);

  const StakeInitializableInstance=useSITContract()
  const Value1:any= account&&   StakeInitializableInstance?.methods.userInfo(account,days).call()
  console.log("Value1", Value1)
const weiAmount:any =  Web3.utils.fromWei(Value1?.amount.toString(), 'ether')
setTotalearned(Value1?.rewardDebt)
console.log(Value1?.rewardDebt)
setTotalstake(weiAmount);

  const Claimtoken = async (e: any) => {
    try {
      const withDays = 0
      e.preventDefault()
      setLoading(true)
      console.log('amount', amount)
      const weiAmount = Web3.utils.toWei(amount.toString(), 'ether')
      const reponse = await StakeInitializableInstance?.methods?.claim(withDays).send({
        from: account
      })
      if (reponse) {
        console.log(reponse)
        setLoading(false)

      
      }
    } catch (err) {
      setLoading(false)
    }
  }
  return (
    <CardBackground show={show} onMouseDown={handleClickOutside}>
      <CardContainer>
        <CloseIconWrapper onClick={()=> onClose()} >
          <img height="19px" width="19px" src={close} alt="close" />
        </CloseIconWrapper>
        <Innerwrapper>
          <TickandContentwrapper>
            <Imglogo src={Oval} />
            <Tick src={Vector} />
          </TickandContentwrapper>
          <StakeContent>Claimed</StakeContent>

          <LowerContent>Your accrued {totalEarned}SPHRI <br></br>
claimed  in your wallet</LowerContent>
        </Innerwrapper>
      </CardContainer>
    </CardBackground>
  )
}

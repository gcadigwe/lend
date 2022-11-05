import React, { Children, useState, useEffect } from 'react'
import close from '../../../assets/images/staking/close.png'
import Bthlogo from '../../../assets/images/cards/headerlogo.svg'
import Oval from '../../../assets/images/staking/Oval.svg'
import Vector from '../../../assets/images/staking/Vector.svg'
import Loader from '../loader/Loader'
import Web3 from 'web3'
import { useSATContract, useUserAccount ,useSITContract} from '../../../contracts/hooks'
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
} from './Finalstakingstyle'

export const Finalstaking = (props: any) => {
  const {days, show , toggleModal, children,setShow,onClose,open } = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
  const [currentChainid, setCurrentChainId] = useState(97);
  const SIT_CONTRACT = (currentChainid === 97) ? process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS : process.env.REACT_APP_RINKEBY_STAKE_INITIALIZABLE_ADDRESS ;
  const StakeInitializableInstance=useSITContract(SIT_CONTRACT)
  console.log("StakeInitializableInstance", StakeInitializableInstance);
  
  const[Apr,setApr]=useState()
const[ClaimTIme,setClaimTime]=useState()
const[totalstake,setTotalstake]=useState(0);
const { account } = useUserAccount()
  
  const  setAprValue=async()=>{
    
    const Value=  await StakeInitializableInstance?.methods.poolInfo(days).call()
  
    console.log(Value[2]);
    setApr(Value[2]);
    const Value1:any= account&&  await StakeInitializableInstance?.methods.userInfo(account,days).call()
  
    const weiAmount:any = Web3.utils.fromWei(Value1.amount.toString(), 'ether')
 
    setTotalstake(weiAmount);
    console.log(Value1);


  }

  useEffect(()=>{
    if(  StakeInitializableInstance){


  
   setAprValue();

    }



  },[StakeInitializableInstance,days])

  return (
    <CardBackground show={show} onMouseDown={handleClickOutside} onClick={()=>onClose()}>
      <Loader open={open}/>
      <CardContainer>
        <CloseIconWrapper onClick={()=> onClose()}>
          <img height="19px" width="19px" src={close} alt="close" onClick={() => setShow(!show)}/>
        </CloseIconWrapper>
        <Innerwrapper>
          <TickandContentwrapper>
            <Imglogo src={Oval} />
            <Tick src={Vector} />
          </TickandContentwrapper>
          <StakeContent>Stake Completed</StakeContent>

          <LowerContent>{totalstake} {currentChainid === 97 || currentChainid === 4 ? "BTC" :"BTC"} at {Apr}% APY, 30 day</LowerContent>
        </Innerwrapper>
      </CardContainer>
    </CardBackground>
  )
}

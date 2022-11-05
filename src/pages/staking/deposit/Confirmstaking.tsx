// @ts-nocheck
import React, { Children, useState ,useEffect} from 'react'
import Web3 from 'web3'
import { useSITContract, useUserAccount,useSATContract } from '../../../contracts/hooks'
import { toast } from "react-toastify";
import Loader from '../loader/Loader'
import close from '../../../assets/images/staking/close.png'
import Bthlogo from '../../../assets/images/cards/headerlogo.svg'
import useMetamaskConnectionStatus  from "../../../contracts/hooks/useMetamaskConnectionStatus"

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
  BottomCenterText
} from './Confirmstakingstyle'
export const Confirmstaking = (props: any) => {
  const {days, show , toggleModal, onNext ,onClose,amount,setAmount,setShowPopup} = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
var Blockfee=0;
  const {
    isMetamaskConnected,
    setIsMetamaskConnected,
    // showWrongNetworkPrompt,
  } = useMetamaskConnectionStatus();
  // const [amount, setAmount] = useState(props.amount);
  const SIT_CONTRACT = (currentChainid === 97) ? process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS : process.env.REACT_APP_RINKEBY_STAKE_INITIALIZABLE_ADDRESS ;
  const StakeInitializableInstance=useSITContract(SIT_CONTRACT)
const[ClaimTime,setclaimTime]=useState(0)
  const[networkfees,setNetworkfees]=useState(0)
  const [loading, setLoading] = useState(false);  
  const depositStake = async(e:any) => {
   
    try{


      if (!isMetamaskConnected) {
        setShowPopup(true)
        return;
      }
      e.preventDefault();
      setLoading(true);
      console.log("instance", StakeInitializableInstance);
      
      console.log("amount", amount);
      
      const weiAmount = Web3.utils.toWei(amount.toString(), "ether");
      const reponse = await StakeInitializableInstance?.methods?.deposit(weiAmount,days ).send({
    from:account
      }) 
      if(reponse){
        setLoading(false);
        // Success toaster

       
        toast.success("Tokens Deposited")
        // Close Modal
      }
      onNext(3)
      console.log(reponse);
    }catch(e){
      // Error Toaster
      // alert(e.message);
      setLoading(false);
    }
    
  }
  const[totalEarned,setTotalearned]=useState()
  const { account } = useUserAccount()
  
  const[Apr,setApr]=useState()
const[totalstake,setTotalstake]=useState(0);
  const StakeTokenInstance = useSATContract()


  
  const  setAprValue=async()=>{
    const Value=  await StakeInitializableInstance?.methods.poolInfo(days).call()

    console.log(Value,account)
    const Value1:any= account&&  await StakeInitializableInstance?.methods.userInfo(account,days).call()
    console.log(StakeInitializableInstance?.methods)
    const weiAmount:any = Web3.utils.fromWei(Value1.amount.toString(), 'ether')
    setTotalstake(weiAmount);
    console.log(Value1.rewardDebt)
    setTotalearned(Value1.rewardDebt)
    const moment = require('moment');


const formatted = moment(parseInt(Value1?.claimTime)).format('L');


    setclaimTime( formatted);
setApr(Value[2]);

const ethereum = window.ethereum;
const web3 = window.web3;
const web3Instance = new Web3(ethereum);
const enabledWeb3 = await ethereum.enable();
// const account = await web3Instance.eth.getAccounts();
var block =  await web3Instance?.eth?.getBlock("latest");
 Blockfee = Web3.utils.fromWei(block?.gasLimit.toString(), 'ether')
// setNetworkfees(block?.gasLimit)
 setNetworkfees( Blockfee)
console.log(Blockfee)


  }


 
  useEffect(()=>{
    if(  StakeInitializableInstance){


  
   setAprValue();

    }



  },[StakeInitializableInstance,days,account,Blockfee])

  

  return (
    <CardBackground show={show} onMouseDown={handleClickOutside} >
          <Loader open={loading}/>
      <CardContainer>
        <CloseIconWrapper onClick={()=> onClose() }>
          <img height="19px" width="19px" src={close} alt="close" />
        </CloseIconWrapper>
        <Headlinewrapper>
          <Headline>Confirm Staking</Headline>
        </Headlinewrapper>
        <Row1wrapper>
          <InnerWrapperRow1>
            <Leftwrapper>
              <Logoicon src={Bthlogo} />
              <StakeandBTcwrapper>
                <Stakeasset>Stake asset</Stakeasset>
                <BTCvalue>{totalstake} BTC</BTCvalue>
              </StakeandBTcwrapper>
            </Leftwrapper>
            <RightWrapper>
              <Aprcontainer>
                <AprContain>{Apr}% APR</AprContain>
              </Aprcontainer>

              <Dayswrapper>
                <DaysContain>{days}days </DaysContain>
              </Dayswrapper>
            </RightWrapper>
          </InnerWrapperRow1>
        </Row1wrapper>
        <InputWrapper>
          <InputUpperWrapper>
            <Singleinput>
              <RightSideContent>Maturity Date</RightSideContent>
              <LeftsideContent>{ClaimTime} UTC</LeftsideContent>
            </Singleinput>
         
            <Singleinput>
              <RightSideContent>Network Fee</RightSideContent>
              <LeftsideContent>{networkfees} BTC</LeftsideContent>
            </Singleinput>
          </InputUpperWrapper>
          <WithdrawNowButtonWrapper>
          <WithDrawNowButton onClick={(e: any) => depositStake(e)}  disabled={loading}   > {loading?"Confirm Staking" : "Confirm and Execute"}</WithDrawNowButton>
        </WithdrawNowButtonWrapper>
        </InputWrapper>
        <BottomSideContainer>
          <BottomSideText>
          Staking will start immediately after clicking "Confirm and Execute".
          </BottomSideText>
          <BottomCenterText>
          * You may unstake your tokens at any time. There is an unstaking period of a month you must wait before withdrawing your staked tokens.

          </BottomCenterText>
        </BottomSideContainer>

      </CardContainer>
    </CardBackground>
  )
}

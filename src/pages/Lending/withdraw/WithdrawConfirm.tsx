import React, { Children, useState,useEffect } from 'react'
import Web3 from 'web3'

import { toast } from "react-toastify"
import { useSITContract, useUserAccount } from '../../../contracts/hooks'
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
} from './withdrawConfirmstyle'
export const Withdrawconfirm = (props: any) => {
  const {days, show , toggleModal, onNext ,onClose,amount,setAmount, setShowPopup} = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
  const { account } = useUserAccount()
  console.log(amount)
  // const [amount, setAmount] = useState(props.amount);
  var Blockfee="0";
  const [loading, setLoading] = useState(false);

  const StakeTokenIntialiableInstance = useSITContract()

  const {
    isMetamaskConnected,
    setIsMetamaskConnected,
    // showWrongNetworkPrompt,
  } = useMetamaskConnectionStatus(); 
  const[networkfees,setNetworkfees]=useState("0")
  const[ClaimTime,setclaimTime]=useState(0)
  const[Apr,setApr]=useState()
  const[ClaimTIme,setClaimTime]=useState()
  const[totalstake,setTotalstake]=useState(0);
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
        onNext(7);
        toast.success('Tokens Withdraw Approved')

      
        // Close Modal
      }
      console.log(reponse)
    } catch (err) {
      // Error Toaster
      // alert(err.message);
      setLoading(false)
    }
  }

    const  setAprValue=async()=>{
      const Value=  await StakeTokenIntialiableInstance?.methods.poolInfo(days).call()
  
      console.log(Value,account)
      
    console.log(Value[2]);
    setApr(Value[2]);
      const Value1:any= account&&  await StakeTokenIntialiableInstance?.methods.userInfo(account,days).call()
  
      const weiAmount:any = Web3.utils.fromWei(Value1?.amount.toString(), 'ether')
      
      const moment = require('moment');
  
  
      const formatted = moment(parseInt(Value1?.claimTime)).format('L');
      
      
          setclaimTime( formatted);
    
   
const ethereum:any = window.ethereum;
const web3 = window.web3;
const web3Instance = new Web3(ethereum);
const enabledWeb3 = await ethereum.enable();
// const account = await web3Instance.eth.getAccounts();
var block =  await web3Instance?.eth?.getBlock("latest");
 Blockfee = Web3.utils.fromWei(block?.gasLimit.toString(), 'ether')
 console.log( Blockfee)
// setNetworkfees(block?.gasLimit)
 setNetworkfees( Blockfee)
console.log(Blockfee)
      setTotalstake(weiAmount);
      console.log(Value1);
 
  
    }
  
    useEffect(()=>{
      if(StakeTokenIntialiableInstance){
  
  
    
     setAprValue();
  
      }
  
  
  
    },[StakeTokenIntialiableInstance,days,account])

  

    // console.log(account)
 
  return (
    <CardBackground show={show} onMouseDown={handleClickOutside} >
          <Loader open={loading}/>
      <CardContainer>
        <CloseIconWrapper onClick={()=> onClose() }>
          <img height="19px" width="19px" src={close} alt="close" />
        </CloseIconWrapper>
        <Headlinewrapper>
          <Headline>Confirm withdraw</Headline>
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
              <RightSideContent>Receive</RightSideContent>
              <LeftsideContent>{amount} BTC</LeftsideContent>
            </Singleinput>
            <Singleinput>
              <RightSideContent>Network Fee</RightSideContent>
              <LeftsideContent>{networkfees} BTC</LeftsideContent>
            </Singleinput>
          </InputUpperWrapper>
          <WithdrawNowButtonWrapper>
          <WithDrawNowButton onClick={(e: any) => withDrawToken(e)}  disabled={loading}   > {loading?"Confirm withdraw" : "Confirm and Execute"}</WithDrawNowButton>
        </WithdrawNowButtonWrapper>
        </InputWrapper>
        <BottomSideContainer>
          <BottomSideText>
          Unstake will start immediately after clicking "Confirm Withdraw".
          </BottomSideText>
          <BottomCenterText>
          * Your accured reward will automatically claimed when you initiate withdraw your assets
          </BottomCenterText>
        </BottomSideContainer>

      </CardContainer>
    </CardBackground>
  )
}

// @ts-ignore
import React, { Children, useEffect, useState } from 'react'
import Web3  from 'web3'
import close from '../../../assets/images/staking/close.png'
import { useSATContract, useUserAccount ,useSITContract} from '../../../contracts/hooks'
import Loader from '../loader/Loader'
import { toast } from 'react-toastify'
import useMetamaskConnectionStatus  from "../../../contracts/hooks/useMetamaskConnectionStatus"
// ../../contracts/hooks/useMetamaskConnectionStatus
// import { crossIcon } from '../icons';
import {
  MarginStyle,
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
  Maxcontain
} from './style'
import { AnyIfEmpty } from 'react-redux'
export const SharedModal = (props: any) => {
  const { show, amount, setAmount, toggleModal, onNext, onClose, days, setDays , setShowPopup} = props
  const [loading, setLoading] = useState(false)
  var Blockfee=0;
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }

  const [isDepositTabOpen, setDepositTabOpen] = useState(false)
  const [isWithDrawTabOpen, setWithDrawTabOpen] = useState(false)

  const { account } : any = useUserAccount();


  console.log(account);
  const[totalEarned,setTotalearned]=useState(0)
const[Apr,setApr]=useState(0)
const[ClaimTime,setclaimTime]=useState(0)

const[totalstake,setTotalstake]=useState(0);
const[walletbal,setWalletbal]=useState(0);
const [currentChainid, setCurrentChainId] = useState(97);
(window as any)?.ethereum?.on('chainChanged', function (networkId:any) {
  // Time to reload your interface with the new networkId
  // const nid = parseInt(networkId);
  // setCurrentChainId(nid)


})
  const StakeTokenInstance = useSATContract()
  const SIT_CONTRACT = (currentChainid === 97) ? process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS : process.env.REACT_APP_RINKEBY_STAKE_INITIALIZABLE_ADDRESS ;
  const StakeInitializableInstance=useSITContract(SIT_CONTRACT)
  console.log("StakeInitializableInstance", StakeInitializableInstance);
  
  const  setAprValue=async()=>{
    const ethereum:any = window.ethereum;
    const enabledWeb3 = await ethereum.enable();
    const web3Instance = new Web3(ethereum);
      const balance = await web3Instance.eth.getBalance(account);
    const walletbalance:any = balance && await Web3.utils.fromWei(balance.toString(),'ether')

    setWalletbal(walletbalance)
    const chainId = await web3Instance.eth.getChainId();
    console.log("chainId", chainId);
    setCurrentChainId(chainId)
        
    const Value=  await StakeInitializableInstance?.methods.poolInfo(days).call()
    setApr(Value[2]);
    // const account = await web3Instance.eth.getAccounts();
   
    const Value1:any= account&&  await StakeInitializableInstance?.methods.userInfo(account,days).call()
      console.log("Value1", Value)
    const weiAmount:any = await Web3.utils.fromWei(Value1?.amount.toString(), 'ether')
    setTotalearned(Value1?.rewardDebt)
    console.log(Value1?.rewardDebt)
    setTotalstake(weiAmount);

const moment = require('moment');
  
  
      const formatted = moment(parseInt(Value1?.claimTime)).format('L');
      
      
          setclaimTime( formatted);

         
  }

  useEffect(()=>{
   
    if(  StakeInitializableInstance){
    // const chainId = await web3Instance.eth.getChainId();
          // console.log("chainId", chainId);
          
      setAprValue();

    }



  },[StakeInitializableInstance,days,account, window])
 
  const {
    isMetamaskConnected,
    setIsMetamaskConnected,
    // showWrongNetworkPrompt,
  } = useMetamaskConnectionStatus();

  // console.log("StakeTokenInstance", StakeTokenInstance?.methods);

  const Selectdays = () => {
    if (!days) {
      alert('please select days')
    }
  }
  const approveStake = async (e: any) => {

    try {

      if (!isMetamaskConnected) {
        setShowPopup(true)
        return;
      }
  
      if (amount <= 0) {
        // Error Toaster
        toast.error('Please enter amount greater than 0')

        return
      }
      e.preventDefault()
      setLoading(true)
      console.log('amount', amount)
      const weiAmount = Web3.utils.toWei(amount.toString(), 'ether')
      const stakeInitializableAddress = process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS
      const reponse = await StakeTokenInstance?.methods?.approve(stakeInitializableAddress, weiAmount).send({
        from: account
      })
      if (reponse) {
        setLoading(false)
        console.log(reponse)
        console.log('vijay')
        // Success toaster
        toast.success('Tokens Approved')
        onNext(2)
        // Close Modal
      }
     
      console.log('Digvijay')
    } catch (err) {
      // Error Toaster
      // alert(err.message);
      toast.error("error");
      
      setLoading(false)
    }
  }
  return (
    <>
      <CardBackground show={show} onMouseDown={handleClickOutside} >
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
            <HeaderText>Stake BTC</HeaderText>
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
                  setDepositTabOpen(true)
                  setWithDrawTabOpen(false)
                }}
                isDepositTabOpen={isDepositTabOpen}
              >
                <div>Deposit</div>
              </DepositTab>
              <WithdrawTab
                onClick={() => {
                  onNext(5)
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
              <RightSideContent1>{totalstake}  {currentChainid === 97 || currentChainid === 4 ? "BTC" :"BTC"}</RightSideContent1>
              <RightSideContent2>My total staked</RightSideContent2>
            </Rightsinglebox>

            <Leftsinglebox>
              <LeftSideContent1>{totalEarned}{currentChainid === 97 || currentChainid === 4 ? "SPHRI" :"SPHRI"}</LeftSideContent1>
              <LeftSideContent2>Reward Earned</LeftSideContent2>
            </Leftsinglebox>
          </Row3>
          <Duration>
            <Stakeduration>Stake Duration</Stakeduration>

            <InnerbuttonWrapper>
              <Button style={{ backgroundColor: days === 0 ? '#57b491' : '' }} onClick={() => setDays(0)}>
                <Buttoncontain>Flexible</Buttoncontain>
              </Button>
              <Button style={{ backgroundColor: days === 30 ? '#57b491' : '' }} onClick={() => setDays(30)}>
                <Buttoncontain>30days</Buttoncontain>
              </Button>
              <Button style={{ backgroundColor: days === 48 ? '#57b491' : '' }} onClick={() => setDays(48)}>
                <Buttoncontain>48days</Buttoncontain>
              </Button>
              <Button style={{ backgroundColor: days === 84 ? '#57b491' : '' }} onClick={() => setDays(84)}>
                <Buttoncontain>84days </Buttoncontain>
              </Button>
            </InnerbuttonWrapper>
          </Duration>

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
          <MarginStyle>
            Wallet Balance : {walletbal} BTC
          </MarginStyle>


          <WithdrawNowButtonWrapper>
            <WithDrawNowButton disabled={loading} onClick={e => approveStake(e)} >
              {' '}
              {loading ? 'Approving Tokens' : 'Stake Now'}
            </WithDrawNowButton>
          </WithdrawNowButtonWrapper>
        </CardContainer>
      </CardBackground>
    </>
  )
}

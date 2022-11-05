import React, { Children, useState } from 'react'
import close from '../../../assets/images/staking/close.png'
import Bthlogo from '../../../assets/images/cards/headerlogo.svg'
import Oval from '../../../assets/images/staking/Oval.svg'
import Vector from '../../../assets/images/staking/Vector.svg'
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
} from './Unstakecompletestyle'
export const Finalstaking = (props: any) => {
  const { show, toggleModal, children,setShow } = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }

  return (
    <CardBackground show={show} onMouseDown={handleClickOutside}>
      <CardContainer>
        <CloseIconWrapper  onClick={() => setShow(!show)}>
          <img height="19px" width="19px" src={close} alt="close" />
        </CloseIconWrapper>
        <Innerwrapper>
          <TickandContentwrapper>
            <Imglogo src={Oval} />
            <Tick src={Vector} />
          </TickandContentwrapper>
          <StakeContent>Unstake Completed</StakeContent>

          <LowerContent>0.24535 BTC at 23.09% APY, 30 day</LowerContent>
        </Innerwrapper>
      </CardContainer>
    </CardBackground>
  )
}

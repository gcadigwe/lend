import React, { Children, useState } from 'react'
import close from '../../../assets/images/staking/close.png'
import Bthlogo from '../../../assets/images/cards/headerlogo.svg'
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
} from './Confirmwithdrawstyle'
export const Confirmwithdraw = (props: any) => {
  const { show, toggleModal, children,amount } = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }

  return (
    <CardBackground show={show} onMouseDown={handleClickOutside}>
      <CardContainer>
        <CloseIconWrapper>
          <img height="19px" width="19px" src={close} alt="close" />
        </CloseIconWrapper>
        <Headlinewrapper>
          <Headline>Unstake BTC</Headline>
        </Headlinewrapper>
        <Row1wrapper>
          <InnerWrapperRow1>
            <Leftwrapper>
              <Logoicon src={Bthlogo} />
              <StakeandBTcwrapper>
                <Stakeasset>Stake asset</Stakeasset>
                <BTCvalue>0.5039 BTC</BTCvalue>
              </StakeandBTcwrapper>
            </Leftwrapper>
            <RightWrapper>
              <Aprcontainer>
                <AprContain>32.65% APR</AprContain>
              </Aprcontainer>

              <Dayswrapper>
                <DaysContain>30 day</DaysContain>
              </Dayswrapper>
            </RightWrapper>
          </InnerWrapperRow1>
        </Row1wrapper>
        <InputWrapper>
          <InputUpperWrapper>
            <Singleinput>
              <RightSideContent>Maturity Date</RightSideContent>
              <LeftsideContent>12 JAN 2022 12:00 UTC</LeftsideContent>
            </Singleinput>
            <Singleinput>
              <RightSideContent>Receive
</RightSideContent>
              <LeftsideContent> 56 BTC </LeftsideContent>
            </Singleinput>
            <Singleinput>
              <RightSideContent>Network Fee</RightSideContent>
              <LeftsideContent>0.0000 BTC</LeftsideContent>
            </Singleinput>
          </InputUpperWrapper>
          <WithdrawNowButtonWrapper>
          <WithDrawNowButton>Confirm Withdraw</WithDrawNowButton>
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

import React, { Children, useState } from 'react'
import close from '../../../assets/images/staking/close.png'
import Loader from '../loader/Loader'
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
  ClaimButton
} from './Withdrawstyle'
export const Withdraw = (props: any) => {
  const { show, toggleModal, amount, setAmount, onClose, onNext } = props
  const handleClickOutside = (e: any) => {
    if (e.target === e.currentTarget) {
      toggleModal()
    }
  }
  const Spin = () => {
    setLoading(true)
  }
  const [isDepositTabOpen, setDepositTabOpen] = useState(false)
  const [isWithDrawTabOpen, setWithDrawTabOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <CardBackground show={show} onMouseDown={handleClickOutside} onClick={()=>onClose()}>
      <Loader open={loading} />
      <CardContainer>
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
              <APRButton>32.65% APR</APRButton>
            </div>
            <div>
              <DaysButton>30 day</DaysButton>
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
            <RightSideContent1>0.00</RightSideContent1>
            <RightSideContent2>My total staked</RightSideContent2>
          </Rightsinglebox>

          <Leftsinglebox>
            <LeftSideContent1>0.00</LeftSideContent1>
            <LeftSideContent2>Earned</LeftSideContent2>
            <div>
              <ClaimButton>Claim</ClaimButton>
            </div>
          </Leftsinglebox>
        </Row3>

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
        <div
          style={{
            color: '#6BE4B9',
            fontWeight: 400,
            fontSize: '12px',
            marginTop: '40px',
            textAlign: 'center'
          }}
        >
          Maturity date : 21 jun 2022 12:23 UST
        </div>
        <WithdrawNowButtonWrapper>
          <WithDrawNowButton onClick={() => onNext(5) && Spin()}>Withdraw Now</WithDrawNowButton>
        </WithdrawNowButtonWrapper>
      </CardContainer>
    </CardBackground>
  )
}

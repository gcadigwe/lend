import { Flex } from 'rebass'
import styled from 'styled-components'

interface I_ModalBodyProps {
  show: boolean
}
export const screenSizes = {
  XS: 480,
  S: 640,
  M: 800,
  L: 1024,
  XL: 1280
}
export const ModalBody = styled.div<I_ModalBodyProps>`
  color: white;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  justify-content: center;
  align-items: center;
  z-index: 500;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(7, 8, 8, 0.7);
  backdrop-filter: blur(1px);
`
export const ModalContent = styled.div<any>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(169.19deg, #22202e 8.02%, #252c32 109.11%);
  border-radius: 20px;
  padding: 20px;
  overflow: auto;
  position: relative;
  max-height: 100%;
  .cross {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    @media (max-width: ${screenSizes.S}px) {
      width: 20px;
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  @media (min-width: ${screenSizes.L}px) {
    width: 450px;
  }
`

export const CardContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  background: #211f2d; // change linear background later
  min-width: 421px;

  min-height: 603px;
  padding: 57px 20px;

  display: flex;
  flex-direction: column;
  border-radius: 20px;
`
export const CardBackground = styled.div<any>`
  display: ${props => (props.show ? 'block' : 'none')};
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
export const CloseIconWrapper = styled.div`
  position: absolute;
  top: 34px;
  right: 39px;
  cursor: pointer;
  border: 1.5px solid #ffffff;
  border-radius: 7px;
  display: flex;
  justify-content: center;
`
export const HeaderLayout = styled.div`
  height: 150px;
  margin-top: 50px;
`
export const CryptoIconWrapper = styled.div`
  display: flex;
  justify-content: center;
`
export const HeaderText = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  margin-top: 14px;
`
export const HeaderContent = styled.div`
  opacity: 0.7;
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  margin-top: 5px;
`
export const HeaderButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`
export const APRButton = styled.button`
  width: 89px;
  height: 26px;
  background: rgba(87, 180, 145, 0.11);
  border-radius: 10px;
  font-weight: 500;
  font-size: 12px;
  color: #57b491;
  border: none;
  outline: none;
  margin-right: 10px;
`
export const DaysButton = styled.button`
  width: 49px;
  height: 26px;
  border: none;
  outline: none;
  background: #57b491;
  border-radius: 10px;
  color: #ffffff;
  font-weight: 400;
  font-size: 12px;
`
export const WithdrawDepositTabsLayout = styled.div`
  display: flex;
  justify-content: center;
`
export const WithdrawDepositTabsContainer = styled.div`
  width: 357px;
  height: 46px;
  background-color: #30303b;
  border-radius: 10px;
  color: #ffffff;
  opacity: 0.8;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`
export const DepositTab = styled.div<any>`
  background-color: ${props => (props.isDepositTabOpen ? '#335AE4' : 'none')};
  border: none;
  border-radius: 8px;
  height: 38px;
  width: 173px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
export const WithdrawTab = styled.div<any>`
  background-color: ${props => (props.isWithDrawTabOpen ? '#335AE4' : 'none')};
  border: none;
  border-radius: 8px;
  height: 38px;
  width: 173px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
export const Row3 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4px;
  margin-bottom: 14px;
`

export const Rightsinglebox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px 16px;
  gap: 10px;
  margin-top: 20px;
  //   position: absolute;
  width: 179px;
  height: 75px;
  left: calc(50% - 179px / 2 - 89px);
  top: 252px;

  background: linear-gradient(175.45deg, rgba(79, 203, 181, 0.19) -27.59%, rgba(79, 203, 181, 0) 96.32%);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`
export const RightSideContent1 = styled.div`
  height: 28px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  /* identical to box height, or 175% */

  display: flex;
  align-items: center;

  /* Green */

  color: #47ecb0;
`
export const RightSideContent2 = styled.div`
  width: 80px;
  height: 18px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  /* identical to box height, or 18px */

  display: flex;
  align-items: center;

  color: #ffffff;

  opacity: 0.7;
`

export const Leftsinglebox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px 16px;
  gap: 10px;
  margin-top: 20px;

  width: 174px;
  height: 75px;
  left: calc(50% - 174px / 2 + 91.5px);
  top: 252px;

  background: linear-gradient(180deg, rgba(252, 183, 120, 0.12) 0%, rgba(252, 183, 120, 0) 100%);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`
export const LeftSideContent1 = styled.div`
  width: 32px;
  height: 28px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  /* identical to box height, or 175% */

  display: flex;
  align-items: center;

  /* Yellow */

  color: #fcb778;
`

export const LeftSideContent2 = styled.div`
  width: 81px;
  height: 18px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  /* identical to box height, or 18px */

  display: flex;
  align-items: center;

  color: #ffffff;

  opacity: 0.7;
`
export const Duration = styled.div`
  display: flex;
  justify-content: space-between;
`
export const Stakeduration = styled.div`
  left: 0%;
  right: 78.55%;
  top: 3.49%;
  bottom: 73.26%;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  /* identical to box height, or 167% */

  text-align: right;

  color: #ffffff;

  opacity: 0.7;
`
export const InnerbuttonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 8px;
`

export const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  gap: 10px;
  margin-right: 10px;
  width: 53px;
  height: 26px;

  background: rgba(0, 0, 0, 0.38);
  border-radius: 6px;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  :hover {
    background: #57b491;
  }
`

export const Buttoncontain = styled.div`
  width: 42px;
  height: 24px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  /* identical to box height, or 200% */

  color: rgba(255, 255, 255, 0.7);

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`
export const WithDrawBTCInputContainer = styled.div`
  margin-top: 14px;
  padding: 0px 32px;
  display: flex;
  justify-content: space-between;
  position: relative;
`
export const Maxwrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
  gap: 10px;
  position: absolute;
  right: 55px;
  top: 10px;
  width: 32px;
  height: 17px;

  background: rgba(255, 255, 255, 0.2);
  border-radius: 40px;

  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 0;
`
export const Maxcontain = styled.div`
  width: 22px;
  height: 7px;
  margin-top: -6px;
  /* margin-right: -12px; */
  padding-right: 22px;
  font-size: 10px;
  background: #ffffff;
  opacity: 0.5;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`
export const InputField = styled.input`
  width: 95%;
  height: 48px;
  background: #0e1218;
  border-radius: 8px;
  outline: none;
  border: none;
  padding: 0px 10px;
  color: #ffffff;
  ::placeholder {
    color: #ffffff;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`
export const WithdrawNowButtonWrapper = styled.div`
  margin-top: 12px;
  //   padding: 0px 32px;
  width: 100%;
  :hover {
    background: linear-gradient(107.84deg, #7acce6 9.82%, #af78f4 139.48%);
  }
`
export const WithDrawNowButton = styled.button`
  width: 100%;
  height: 60px;
  background: linear-gradient(107.84deg, #65b6d0 9.82%, #884dd3 139.48%);
  border-radius: 8px;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
`
export const Headlinewrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`
export const Headline = styled.div`
  height: 30px;
  left: 123px;
  top: 75px;

  /* H4 */

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;
  /* identical to box height, or 125% */

  letter-spacing: 0.113382px;

  /* White */

  color: rgba(255, 255, 255, 0.9);
`

export const Row1wrapper = styled.div`
  padding: 27px;
  height: 87px;
  right: 32px;
  top: 129px;

  background: linear-gradient(98.03deg, rgba(99, 154, 205, 0.4) -6.11%, rgba(51, 90, 228, 0.28) 108.32%);
  border-radius: 8px;
`

export const InnerWrapperRow1 = styled.div`
display:flex;
flex-direction:row;
align-items:center;
justify-content:space-between'
`
export const Leftwrapper = styled.div`
  display: flex;
  flex-direction: row;
`
export const Logoicon = styled.img`
  height: 36px;
  width: 36px;
`
export const StakeandBTcwrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`
export const Stakeasset = styled.div`
  width: 67px;
  height: 16px;
  right: 252px;
  top: 153px;

  /* Title/Label 04 */

  font-family: 'Manrope';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height, or 133% */

  color: rgba(255, 255, 255, 0.6);
`
export const BTCvalue = styled.div`
  width: 87px;
  height: 18px;
  right: 232px;
  top: 171px;

  /* Label 1 */

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  /* identical to box height, or 112% */

  /* White */

  color: rgba(255, 255, 255, 0.9);
`

export const RightWrapper = styled.div`
  display: flex;
  justify-content: space-betwen;
`
export const Aprcontainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3px 8px;
  gap: 10px;

  margin-right: 10px;
  width: 84px;
  height: 26px;
  left: calc(50% - 84px / 2 + 63.5px);
  top: 156px;

  background: rgba(87, 180, 145, 0.21);
  border-radius: 6px;
`

export const AprContain = styled.div`
  width: 68px;
  height: 20px;

  font-family: 'Manrope';
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  /* identical to box height, or 167% */

  /* Info shade/Green */

  color: #6be4b9;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`

export const Dayswrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  gap: 10px;

  width: 77px;
  height: 26px;
  right: 56px;
  top: 156px;

  background: rgba(67, 160, 125, 0.3);
  border-radius: 6px;
`
export const DaysContain = styled.div`
  width: 36px;
  height: 24px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  /* identical to box height, or 200% */

  /* Info shade/Green */

  color: #6be4b9;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`

export const InputWrapper = styled.div`
  /* Auto layout */

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 14px 6px;
  gap: 12px;

  position: absolute;
  width: 358px;
  height: 205px;
  right: 31px;
  top: 228px;

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`

export const InputUpperWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`

export const Singleinput = styled.div`
  display: Flex;
  justify-content: space-between;
`
export const RightSideContent = styled.div`
  height: 20px;
  margin-bottom: 10px;
  /* Body 2 */

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  /* identical to box height, or 143% */

  color: #ffffff;

  opacity: 0.6;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`

export const LeftsideContent = styled.div`
  height: 20px;

  /* Body 2 */

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 143% */

  color: #ffffff;

  opacity: 0.7;

  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 0;
`
export const BottomSideContainer = styled.div`
  //   height: 50px;
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

export const BottomSideText = styled.h2`
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 450;
  font-size: 14px;
  line-height: 26px;
  /* or 186% */
  position: absolute;
  bottom: 80px;
  width: 70%;

  display: flex;
  align-items: center;
  text-align: center;

  /* Grey Scale/Grey_700 */

  color: #c3c0c9;
`
export const BottomCenterText = styled.h2`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  margin-top: 22px;
  /* or 167% */
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  text-align: center;

  /* Grey Scale/Grey_700 */

  color: #c3c0c9;

  opacity: 0.7;
  position: absolute;
  bottom: 37px;
  width: 70%;
`

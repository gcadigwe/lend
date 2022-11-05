import styled from 'styled-components'

export const CardContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  background: #211f2d; // change linear background later
  min-width: 421px;

  min-height: 603px;
  padding: 34px 24px 24px 32px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
`
export const CardBackground = styled.div<any>`
  display: ${props => (props.open ? 'block' : 'none')};
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
  cursor: pointer;
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
  font-size: 11px;
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

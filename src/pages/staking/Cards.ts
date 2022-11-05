import styled from 'styled-components'

export const SingleWrapper = styled.div``

export const SingleCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
    /* For portrait layouts only */

    height: 305px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }
`

export const Cardheader = styled.div`
  height: 105px;
  padding: 24px 24px 24px 24px;
  display: flex;
  justify-content: space-between;
`

export const Cardlogo = styled.img`
  width: 38px;
  height: 38px;
`
export const CardHeadline = styled.div`
  display: flex;
  flex-direction: column;
`
export const MainHead = styled.div`
  width: 98px;
  height: 18px;
  left: 366px;
  top: 203px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  /* identical to box height, or 100% */

  color: rgba(255, 255, 255, 0.9);
`
export const Tagline = styled.div`
  width: 144px;
  height: 18px;
  left: 366px;
  top: 225px;

  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  /* identical to box height, or 150% */

  color: #ffffff;

  opacity: 0.7;
  margin-top: 4px;
`

export const ApIr = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3px 8px;
  gap: 10px;

  width: 84px;
  height: 26px;
  left: 540px;
  top: 210px;

  background: rgba(87, 180, 145, 0.11);
  border-radius: 10px;
`
export const Aprvalue = styled.div`
  width: 68px;
  height: 20px;

  font-family: 'Manrope';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  /* identical to box height, or 167% */

  /* Color Pallete/Success */

  color: #57b491;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`
export const CardMiddleWrapper = styled.div`
  width: 100%;
  height: 144px;
  left: 296px;
  top: 267px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
`
export const Eachrow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`
export const EachrowValue = styled.div`
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  /* identical to box height, or 167% */

  color: #ffffff;

  opacity: 0.6;
`
export const CardLower = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 32px;
  height: 61px;
  left: 20.56%;
  right: 55.28%;
  top: 49.5%;
  bottom: 43.48%;
  cursor: pointer;
  background: linear-gradient(107.84deg, #65b6d0 9.82%, #884dd3 139.48%);
  border-radius: 8px;
  :hover {
    background: linear-gradient(107.84deg, #7acce6 9.82%, #af78f4 139.48%);
  }
`
export const ButtonHeadline = styled.div`
  width: 108px;
  height: 18px;
  cursor: pointer;
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  /* identical to box height, or 112% */

  color: #ffffff;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  @media only screen and (min-device-width: 320px) and (max-device-width: 425px) and (orientation: portrait) {
  }
`

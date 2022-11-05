import styled from 'styled-components'
import { AutoColumn } from '../Column'

//import uImage from '../../assets/images/big_unicorn.png'
import xlUnicorn from '../../assets/images/xl_uni.png'
//import noise from '../../assets/images/noise.png'

export const TextBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  width: fit-content;
  justify-self: flex-end;
`

export const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
  border-radius: 12px;
  max-width: 1075px;
  width: 100%;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.54px;
  text-align: left;
  //padding: 0px 76px 36px 0px;
  position: relative;
  overflow: hidden;
  
`

export const CardBGImage = styled.span<{ desaturate?: boolean }>`
  background-color: #2e3274;
  width: 1075px;
  height: 240px;
  position: absolute;
  border-radius: 12px;
  // opacity: 0.3;
  //top: -100px;
  //left: -100px;
  //transform: rotate(-15deg);
  user-select: none;

  ${({ desaturate }) => desaturate && `filter: saturate(0)`}
`

export const CardBGImageSmaller = styled.span<{ desaturate?: boolean }>`
  background: url(${xlUnicorn});
  width: 1200px;
  height: 1200px;
  position: absolute;
  border-radius: 12px;
  top: -300px;
  left: -300px;
  opacity: 0.4;
  user-select: none;

  ${({ desaturate }) => desaturate && `filter: saturate(0)`}
`

export const CardNoise = styled.span`
  background-color: #212a3b;
  background-size: cover;
 // mix-blend-mode: overlay;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  //opacity: 0.15;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
`

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && '0.4'};
`

export const Break = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
`

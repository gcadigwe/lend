import styled from 'styled-components'

export const ApplOverlay=styled.div`
position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

export const CardContainer=styled.div`
width: 421px;
height: 603px;
left: 509px;
top: 97px;

/* Bg */

background: linear-gradient(169.19deg, #22202E 8.02%, #252C32 109.11%);
border-radius: 20px;
padding:34px 32px 24px 32px;
`
export const CardWrapper=styled.div`



`

export const CardRow1=styled.div`
display:flex;
flex-direction:column;
justify-content:space-between;
`
export const Cardlogo=styled.img`


`
export const Headline=styled.div`
width: 87px;
height: 18px;
left: calc(50% - 87px/2 + 2px);
top: 100px;

font-family: 'Archivo';
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 18px;
/* identical to box height, or 100% */


color: rgba(255, 255, 255, 0.9);

`
export const Tagline=styled.div`
width: 144px;
height: 18px;
left: calc(50% - 144px/2 + 0.5px);
top: 122px;

font-family: 'Archivo';
font-style: normal;
font-weight: 500;
font-size: 12px;
line-height: 18px;
/* identical to box height, or 150% */


color: #FFFFFF;

opacity: 0.7;

`
export const Apr=styled.div`
flex-direction: row;
justify-content: center;
align-items: center;
padding: 3px 8px;
gap: 10px;

position: absolute;
width: 84px;
height: 26px;
left: calc(50% - 84px/2 + 0.5px);
top: 150px;

background: rgba(87, 180, 145, 0.11);
border-radius: 10px;

`

export const AprContent=styled.div`
width: 68px;
height: 20px;

font-family: 'Manrope';
font-style: normal;
font-weight: 500;
font-size: 12px;
line-height: 20px;
/* identical to box height, or 167% */


/* Color Pallete/Success */

color: #57B491;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;

`

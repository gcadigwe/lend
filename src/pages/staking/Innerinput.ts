import styled from 'styled-components'

export const Container=styled.div`
width:357px;
display:flex;
flex-direction:column;
justify-content:space-between;
`
export const Row1=styled.div`
display:flex;
justify-content:space-between;
`

export const Rightbutton=styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 8px 16px;
gap: 10px;

position: absolute;
width: 179px;
height: 75px;
left: calc(50% - 179px/2 - 89px);
top: 252px;

background: linear-gradient(175.45deg, rgba(79, 203, 181, 0.19) -27.59%, rgba(79, 203, 181, 0) 96.32%);
border: 1px solid rgba(255, 255, 255, 0.03);
border-radius: 8px;


`

export const RightContent=styled.div`
box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 8px 16px;
gap: 10px;

position: absolute;
width: 179px;
height: 75px;
left: calc(50% - 179px/2 - 89px);
top: 252px;

background: linear-gradient(175.45deg, rgba(79, 203, 181, 0.19) -27.59%, rgba(79, 203, 181, 0) 96.32%);
border: 1px solid rgba(255, 255, 255, 0.03);
border-radius: 8px;
`

export const RightContent1=styled.div`
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

/* Green */

color: #47ECB0;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;

` 
export const RightContent2=styled.div`
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

color: #FFFFFF;

opacity: 0.7;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
`
export const Leftbutton=styled.div`

/* Auto layout */

display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 8px 16px;
gap: 10px;

position: absolute;
width: 174px;
height: 75px;
left: calc(50% - 174px/2 + 91.5px);
top: 252px;

background: linear-gradient(180deg, rgba(252, 183, 120, 0.12) 0%, rgba(252, 183, 120, 0) 100%);
border: 1px solid rgba(255, 255, 255, 0.03);
border-radius: 8px;

`

export const LeftContent=styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 8px 16px;
gap: 10px;

position: absolute;
width: 174px;
height: 75px;
left: calc(50% - 174px/2 + 91.5px);
top: 252px;

background: linear-gradient(180deg, rgba(252, 183, 120, 0.12) 0%, rgba(252, 183, 120, 0) 100%);
border: 1px solid rgba(255, 255, 255, 0.03);
border-radius: 8px;
`
export const LeftContent1=styled.div`
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

color: #FCB778;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;

`
export const LeftContent2=styled.div`
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

color: #FFFFFF;

opacity: 0.7;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
`


export const Row2=styled.div`
display:grid;
justify-content:space-between;
`
export const Row2Content1=styled.div`
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

color: #FFFFFF;

opacity: 0.7;

`
export const Row2ContentLeft=styled.div`

`

export const InputField=styled.div`
width: 357px;
height: 48px;
left: 0px;
top: 38px;

background: #0E1218;
border-radius: 8px;

`
export const InputFieldWrapper=styled.div`
display:flex;
justify-content:space-between;

`
export const InputFieldRight=styled.div`
width: 29px;
height: 16px;

font-family: 'Archivo';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 16px;
/* identical to box height, or 114% */


color: #FFFFFF;

opacity: 0.4;

/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;

`

export const InputFieldLeftButton=styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 5px;
gap: 10px;

width: 32px;
height: 17px;

background: rgba(255, 255, 255, 0.2);
border-radius: 40px;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;

`


export const InputFieldButton=styled.div`
width: 22px;
height: 7px;

background: #FFFFFF;
opacity: 0.5;

/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
`
export const Row3=styled.div`
width: 160px;
height: 20px;
left: calc(50% - 160px/2 + 0.5px);
top: 437px;

font-family: 'Archivo';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 20px;
/* identical to box height, or 167% */


color: #FFFFFF;

opacity: 0.6;

`
export const Button=styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 16px 32px;
gap: 10px;

position: absolute;
width: 357px;
height: 60px;
left: calc(50% - 357px/2);
top: 469px;

/* Gradient button */

background: linear-gradient(107.84deg, #65B6D0 9.82%, #884DD3 139.48%);
border-radius: 8px;

`

export const Buttoncontent=styled.div`
width: 78px;
height: 18px;

font-family: 'Archivo';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */


color: #FFFFFF;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;
`

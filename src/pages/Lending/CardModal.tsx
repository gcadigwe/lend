import React, { useState } from 'react'

import {
  SingleCard,
  Cardheader,
  Cardlogo,
  CardHeadline,
  MainHead,
  Tagline,
  ApIr,
  Aprvalue,
  CardMiddleWrapper,
  Eachrow,
  EachrowValue,
  CardLower,
  SingleWrapper,
  ButtonHeadline,
  CheckBox,
  CheckBoxWrapper,
  CheckBoxLabel
} from './Cards'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Toggle } from 'react-toggle-component'
import { SharedModal } from './sharedmodel/SharedModel'
// import { Withdraw } from './withdraw/Withdraw'
import { UnstakeBTC } from './withdraw/UnstakeBTC'
// import { Confirmstaking } from './deposit/Confirmstaking'
// import { Confirmwithdraw } from './withdraw/Confirmwithdraw'
// import { Finalstaking } from './deposit/Finalstaking'
// import { LpStake } from './deposit/LpStake'
// import { Claimed } from './withdraw/Claimed'
// import { Confirmunstaking } from './withdraw/Confirmunstaking'
import { ZAxis } from 'recharts'
// import { Withdrawconfirm } from './withdraw/WithdrawConfirm'
const CardModal = ({
  img,
  mainhead,
  tagline,
  apr,
  eachrow1Value1,
  eachrow1Value2,
  eachrow2Value1,
  eachrow2Value2,
  eachrow3Value1,
  eachrow3Value2,
  buttonhead,
  setShowPopup
}: any) => {
  // const [Openmodal,Setopenmodal]=useState();
  const [showmodal, SetshowModal] = useState(false)
  const [show, SetShow] = useState(false)
  const [amount, setAmount] = useState(0)
  const [withDrawAmount, setwithDrawAmount] = useState(0)
  const [index, setIndex] = useState(1)
  const [days, setDays] = useState(30)
  const [Deposite, setDeposite] = useState(0)
  const [withDays, setWithdrawDays] = useState(30)

  const onClose = () => {
    SetShow(!show)
    setIndex(1)
  }
  interface DynamicStyleObject {
    [key: string]: string | number
    index: number
  }

  const Openmodal = () => {
    SetShow(!show)
  }

  const steps: { [key: number]: any } = {
    0: '',
    1: SharedModal,
    //   2: Confirmstaking,
    //   3: Finalstaking,
    //   4: Withdraw,
    5: UnstakeBTC
    //   6: Withdrawconfirm,
    //   7: Confirmunstaking,
    //   8: Claimed
  }

  const Component = steps[index]

  const onNext = (e: number) => {
    setIndex(e)
    console.log('e', e)
  }

  return (
    //   <CardLayout>
    //   <CardContainer>
    //     <CardImageWrapper>
    //       <CardImage src={img} />
    //     </CardImageWrapper>
    //   </CardContainer>
    //   <CardText >
    //    {text1}
    //   </CardText>
    //   <CardDateText>{text2}</CardDateText>
    // </CardLayout>
    <>
      <SingleCard>
        <SingleWrapper>
          <Cardheader>
            <Cardlogo style={{ marginRight: '10px' }} src={img} />
            <CardHeadline>
              <MainHead>{mainhead} </MainHead>
              <Tagline>{tagline}</Tagline>
            </CardHeadline>
          </Cardheader>
          <CardMiddleWrapper style={{ marginBottom: '10px' }}>
            <Eachrow>
              <EachrowValue>{eachrow1Value1}</EachrowValue>

              <Toggle
                leftBackgroundColor="rgba(255, 255, 255, 0.2)"
                rightBackgroundColor="#7546FD"
                borderColor="none"
                knobColor="white"
                name={eachrow1Value2}
                onToggle={e => console.log('onToggle')}
              />
            </Eachrow>
            <Eachrow>
              <EachrowValue>{eachrow2Value1}</EachrowValue>
              <EachrowValue>{eachrow2Value2}</EachrowValue>
            </Eachrow>

            <Eachrow>
              <EachrowValue>{eachrow3Value1}</EachrowValue>
              <EachrowValue>{eachrow3Value2}</EachrowValue>
            </Eachrow>
          </CardMiddleWrapper>
          <CardLower onClick={Openmodal}>
            <ButtonHeadline>{buttonhead} </ButtonHeadline>
          </CardLower>
        </SingleWrapper>
      </SingleCard>

      {/* <SharedModal amount={amount} setAmount={setAmount}></SharedModal>
      <Confirmstaking amount={amount}  show={show}  setAmount={setAmount}  setShow={SetShow}
        toggleModal={() => SetShow(false)}></Confirmstaking>
      <Finalstaking></Finalstaking> */}

      <Component
        onNext={onNext}
        closeModal={() => SetShow(false)}
        show={show}
        onClose={onClose}
        amount={steps[index] === 4 || steps[index] === 5 || steps[index] === 6 ? withDrawAmount : amount}
        setAmount={steps[index] === 4 || steps[index] === 5 || steps[index] === 6 ? setwithDrawAmount : setAmount}
        days={steps[index] === 4 || steps[index] === 5 || steps[index] === 6 ? withDays : days}
        setDays={steps[index] === 4 || steps[index] === 5 || steps[index] === 6 ? setWithdrawDays : setDays}
        Deposite={Deposite}
        setDeposite={setDeposite}
        setShowPopup={setShowPopup}
      />

      {/* <Withdraw></Withdraw> */}

      {/* <UnstakeBTC
        amount={withDrawAmount}
        setAmount={setwithDrawAmount}
       
        
      ></UnstakeBTC> */}
      {/* <Confirmunstaking></Confirmunstaking> */}
      {/* <Claimed></Claimed> */}
      {/* <button style={{background:'green'}}onClick={()=>HandleClick()}>CLOSE</button>
</StakingCustomModalcard>  */}
    </>
  )
}

export default CardModal



import {
  Container,
  Row1,
  Rightbutton,
  RightContent,
  RightContent1,
  RightContent2,
  Leftbutton,
  LeftContent,
  LeftContent1,
  LeftContent2,
  Row2,
  Row2Content1,
  Row2ContentLeft,
  InputField,
  InputFieldWrapper,
  InputFieldRight,
  InputFieldLeftButton,
  InputFieldButton,
  Row3,
  Button,
  Buttoncontent
} from './Innerinput'


const Innerinput = () => {
  return (
    <Container>
      <Row1>
        <Rightbutton>
          <RightContent>
            <RightContent1>0.00</RightContent1>
            <RightContent2>My total staked</RightContent2>
          </RightContent>
        </Rightbutton>
        <Leftbutton>
          <LeftContent>
            <LeftContent1>0.00</LeftContent1>

            <LeftContent2>Reward earned</LeftContent2>
          </LeftContent>
        </Leftbutton>
      </Row1>
<Row2>
<Row2Content1>

    Stake Duration
</Row2Content1>


</Row2>



    </Container>
  )
}

export default Innerinput

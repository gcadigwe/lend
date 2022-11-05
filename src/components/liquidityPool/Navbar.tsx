import { RowBetween } from 'components/Row'
import React from 'react'
import Settings from '../../components/Settings'
import styled from 'styled-components'
import Account from 'components/Account'

const NavbarWrapper = styled.div`
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-columns: 5fr 7fr;

  & #liq {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    .title {
      font-size: 25px;
      font-weight: 500;
      color: #151928;
      margin-left: 5px;
    }

    .subtitle {
      color: #151928;
      font-weight: 400;
      font-size: 16px;
    }
  }
`

const Navbar = () => {
  return (
    <NavbarWrapper>
      <div id="liq">
        <p className="title"> Liquidity</p>
        <div className="subtitle">Learn About providing liquidity </div>
        <div>
          <Settings />
        </div>
      </div>

      <Account />
    </NavbarWrapper>
  )
}

export default Navbar

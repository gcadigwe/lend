import React, { useRef } from 'react'
import {User, HelpCircle,  LogOut, Gift } from 'react-feather'
import styled, {keyframes} from 'styled-components'
//import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'
import { ButtonPrimary } from '../Button'

import userImage from '../../assets/images/user.png'


// const StyledUserIcon = styled.div`
// background: url(${userImage});
//   width: 15.1px;
//   height: 18.1px;
//   object-fit: contain;
//   //border-radius: 8px;

// `

// const StyledMenuButton = styled.button`
// width: 45px;
// height: 45px;
// margin: 3.9px 3 4.1px 9px;
// padding: 13px 14.9px 13px 14px;
// border-radius: 8px;
// border: solid 1px  #ffffff;
// //box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.16);
// background-color: #212a3b;

//   :hover,
//   :focus {
//     cursor: pointer;
//     outline: none;
//     background-color: ${({ theme }) => theme.bg5};
//   }

//   svg {
//     margin-top: 2px;
//   }
// `
const pulse = keyframes`
  0% {
    transform: translateY(5px);

  }
  20% {
    
    transform: translateY(0px);
  }
  85% {
    
    transform: translateY(0px);
  }
  100% {
  
    transform: translateY(5px);
  }

`


const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  border-radius: 8px;
  text-align: left;
  animation: ${pulse} 700ms infinite;
`

// const MenuFlyout = styled.span`
//   min-width: 8.125rem;
//   box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
//     0px 24px 32px rgba(0, 0, 0, 0.01);
//   border-radius: 12px;
//   display: flex;
//   flex-direction: column;
//   position: absolute;
//   top: 4rem;
//   right: 0rem;
//   z-index: 100;
//   width: 200px;
//   height: 225px;
//   padding: 21.4px 42px 38.5px 27.8px;
//   border: solid 2px rgba(255, 255, 255, 0.5);
//   background-color: #212a3b;
//   font-size: 17px;
//   font-weight: 500;
//   line-height: 1.5;
//   color: #ffffff;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     top: -17.25rem;
//   `};
// `

// const MenuItem = styled(ExternalLink)`
//   flex: 1;
//   padding: 0.5rem 0.5rem;
//   color: #fff;
//   :hover {
//     color: #f3ba2f;
//     cursor: pointer;
//     text-decoration: none;
//   }
//   > svg {
//     margin-right: 8px;
//   }
// `

// const CODE_LINK = '#'

export default function Menu() {
  const { account } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      {/* <StyledMenuButton onClick={toggle}>
        <StyledUserIcon />
      </StyledMenuButton> */}

        {/* <MenuFlyout> */}
          {/* <MenuItem id="link" href="#"> */}
            {/* todo */}
            {/* <User style={{width: 26, height: 26, margin: '0 15.2 -5 0', color: "#5b94ed", border: "solid 2px #5b94ed", borderRadius: 12}}/>
            Login */}
          {/* </MenuItem>
          <MenuItem id="link" href="#"> */}
            {/* todo */}
            {/* <LogOut style={{width: 26, height: 26, margin: "0 15.2 -5 0", color: "#5b94ed"}}  />
            Register
          </MenuItem> */}
          {/* <MenuItem id="link" href={CODE_LINK}> */}
            {/* todo */}
            {/* <HelpCircle style={{width: 26, height: 26, margin: "0 15.2 -5 0", color: "#5b94ed"}} />
            Support
          </MenuItem> */}
          {account && (
            <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem" fontSize={14} style={{backgroundImage: "linear-gradient(157deg , #ce51ff -98%, #21c7ff 168%)"}}>
              Claim Reward <Gift width={35}/>
            </ButtonPrimary>
          )}
        {/* </MenuFlyout> */}
    
    </StyledMenu>
  )
}

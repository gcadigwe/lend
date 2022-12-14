import React from 'react'
import styled, { css } from 'styled-components'
import { animated, useTransition, useSpring } from 'react-spring'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { isMobile } from 'react-device-detect'
import '@reach/dialog/styles.css'
import { transparentize } from 'polished'
import { useGesture } from 'react-use-gesture'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 9999999;
    background-color: #fff;
    overflow: hidden;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: center;
  `};

  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
  &[data-reach-dialog-content] {
    margin: 0 0 0rem 0;
    justify-content: center;
    z-index: 9999999;
    border-radius: 20px;
    background-image: linear-gradient(169.19deg, #22202E 8.02%, #252C32 109.11%);
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: 50vw;
    overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'scroll')};
    overflow-x: hidden;

    align-self: ${({ mobile }) => (mobile ? 'center' : 'center')};

    max-width: 420px;
    min-height: 630px;
    max-height:  630px;
    display: flex;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}

    @media (max-width: 845px) {
      max-height: 80%;
      //min-height: 80%;
    } 

    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${mobile &&
        css`
          width: 95vw;
          border-radius: 20px;
          // border-bottom-left-radius: 0;
          // border-bottom-right-radius: 0;
        `}
    `}

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    align-self: center;
    overflow-y: scroll;
    border-radius: 16px;
  `};
  
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function TransactionModal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    }
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay key={key} style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: { transform: y.interpolate(y => `translateY(${y > 0 ? y : 0}px)`) }
                    }
                  : {})}
                  
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}

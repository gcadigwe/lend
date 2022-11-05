import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  height: 450px;
  max-width: 620px;
  margin-bottom: 3rem;
  width: 100%;
  background-image: linear-gradient(150deg, #0f0c29 -81%, #182128 58%);
  //background-color: #212a3b;
  box-shadow: 0 3px 10px #2e4c93;
  border-radius: 30px;
  /* padding: 1rem; */

  ${({ theme }) => theme.mediaWidth.upToSmall`
  height: 600px;
  max-width: 463px;
`};
`



/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
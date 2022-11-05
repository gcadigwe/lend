import React from 'react'
import USDLogo from '../../assets/svg/usd_logo.svg'
import SpheriumLogo from '../../assets/svg/sphri_logo.svg'
import styled from 'styled-components'
import { Currency } from './config'

const Header = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.49);
  padding: 6px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.49);
  margin-bottom: 15px;
`

const ChainsList = styled.div`
  height: calc(100vh - 200px);
  overflow: auto;
`
const ChainItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 4px;
  height: 40px;
  margin-bottom: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 13px;

  .name {
    margin-right: 1px;
  }
`

const NoResultFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  color: #f84b6a;
  height: 500px;
`

type Props = {
  chains: any[]
  onUpdate(c: Currency): void
}

const Chains: React.FC<Props> = ({ chains, onUpdate }) => {
  return (
    <div>
      {chains.length > 0 ? (
        <div>
          <Header>
            <p>Chain Name</p>
          </Header>

          <ChainsList>
            {chains.map(c => (
              <ChainItem onClick={() => onUpdate(c)} key={c.name}>
                <p className="name">{c.name}</p>
              </ChainItem>
            ))}
          </ChainsList>
        </div>
      ) : (
        <NoResultFound>No Result Found</NoResultFound>
      )}
    </div>
  )
}

export default Chains

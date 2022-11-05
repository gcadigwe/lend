import useContract from './useContract';
import SATF_ABI from '../staketoken.json';

const SATF_CONTRACT = process.env.REACT_APP_STAKE_TOKEN_FACTORY_ADDRESS;
const useSATFContract = () => useContract(SATF_CONTRACT, SATF_ABI.abi, false);

export default useSATFContract;
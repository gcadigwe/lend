import useContract from './useContract';
import SAT_ABI from '../staketoken.json';

const SAT_CONTRACT = process.env.REACT_APP_STAKE_TOKEN_ADDRESS;
const useSATContract = () => useContract(SAT_CONTRACT, SAT_ABI.abi, false);

export default useSATContract;
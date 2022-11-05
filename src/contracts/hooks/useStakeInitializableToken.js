import useContract from './useContract';
import SIT_ABI from '../stakeinitializable.json';

// const SIT_CONTRACT = process.env.REACT_APP_STAKE_INITIALIZABLE_ADDRESS;
const useSITContract = (SIT_CONTRACT) => useContract(SIT_CONTRACT, SIT_ABI.abi, false);

export default useSITContract;
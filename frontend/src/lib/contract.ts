import RepNFT from '@shared/abi/RepNFT.json';
import { CONTRACT_ADDRESS } from '@shared/constants';

// Phase 4: Exports read functions
export const getRepNFTContract = () => {
    return { abi: RepNFT, address: CONTRACT_ADDRESS };
};

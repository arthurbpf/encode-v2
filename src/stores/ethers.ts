import { trimAddress } from '@/lib/ethers/utils';
import { create } from 'zustand';

interface EthersStore {
	userAddress: string;
	setUserAddress: (userAddress: string) => void;
	getTrimmedUserAddress(): string;
}

export const useEthersStore = create<EthersStore>((set, get) => ({
	userAddress: '',
	setUserAddress: (userAddress) => set({ userAddress: userAddress }),
	getTrimmedUserAddress: () => {
		const address = get().userAddress;

		return trimAddress(address);
	}
}));

export const setUserAddress = useEthersStore.getState().setUserAddress;
export const getTrimmedUserAddress =
	useEthersStore.getState().getTrimmedUserAddress;

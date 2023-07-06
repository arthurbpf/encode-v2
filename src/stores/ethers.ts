import { create } from 'zustand';

interface EthersStore {
	userAddress: string;
	setUserAddress: (userAddress: string) => void;
	getTrimmedUserAddress(): string;
}

export const useEthersStore = create<EthersStore>((set, get) => ({
	userAddress: '',
	setUserAddress: (userAddress) => set({ userAddress }),
	getTrimmedUserAddress: () => {
		const address = get().userAddress;

		if (!address) return '';

		return (
			address.substring(0, 5) +
			'...' +
			address.substring(address.length - 4, address.length)
		);
	}
}));

export const setUserAddress = useEthersStore.getState().setUserAddress;
export const getTrimmedUserAddress =
	useEthersStore.getState().getTrimmedUserAddress;

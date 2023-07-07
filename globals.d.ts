import { Eip1193Provider } from 'ethers';

type EventMap = {
	accountsChanged: (accounts: Array<string>) => void;
};

interface MetamaskProvider extends Eip1193Provider {
	on<T extends keyof EventMap>(event: T, callback: EventMap[T]): void;
}

declare global {
	interface Window {
		ethereum?: MetamaskProvider;
	}
}

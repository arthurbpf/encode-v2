import { setUserAddress } from '@/stores/ethers';

export function setAccountsChangedEvent() {
	if (window.ethereum) {
		window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
			setUserAddress(accounts[0] || '');
			window.location.reload();
		});
	}
}

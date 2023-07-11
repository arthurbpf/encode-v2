import { setUserAddress } from '@/stores/ethers';

import { getCurrentAccountAddress } from './utils';

export async function setAccountsChangedEvent() {
	if (window.ethereum) {
		setUserAddress(await getCurrentAccountAddress());

		window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
			setUserAddress(accounts[0] || '');
			window.location.reload();
		});
	}
}

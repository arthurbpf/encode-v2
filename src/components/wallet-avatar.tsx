import { useEthersStore } from '@/stores/ethers';

import { Avatar } from './ui/avatar';

const WalletAvatar = () => {
	const { getTrimmedUserAddress } = useEthersStore();
	const userAddress = getTrimmedUserAddress();

	return (
		<div>
			{userAddress}
			<Avatar />
		</div>
	);
};

export default WalletAvatar;

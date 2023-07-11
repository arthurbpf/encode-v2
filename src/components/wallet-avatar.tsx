import { connectWallet } from '@/lib/ethers/utils';
import { useEthersStore } from '@/stores/ethers';
import Link from 'next/link';

import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface AvatarButtonProps {
	userAddress?: string;
	onClick?: () => void;
}

const AvatarButton = ({ userAddress, onClick }: AvatarButtonProps) => {
	return (
		<Button
			variant={'outline'}
			size={userAddress ? 'default' : 'icon'}
			className="flex gap-2"
			onClick={onClick}
		>
			{userAddress}
			<Avatar className="h-7 w-7">
				<AvatarImage src={userAddress ? 'user.svg' : 'lock.svg'} />
			</Avatar>
		</Button>
	);
};

const WalletAvatar = () => {
	const { getTrimmedUserAddress } = useEthersStore();
	const userAddress = getTrimmedUserAddress();

	if (userAddress) {
		return (
			<Link href={`${userAddress}/tokens`}>
				<AvatarButton userAddress={userAddress} />
			</Link>
		);
	} else {
		return <AvatarButton onClick={connectWallet} />;
	}
};

export default WalletAvatar;

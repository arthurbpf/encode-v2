'use client';

import { Button } from '@/components/ui/button';
import { connectWallet } from '@/lib/ethers/utils';
import { useEthersStore } from '@/stores/ethers';
import Link from 'next/link';
import { LuHammer, LuSearch, LuWallet } from 'react-icons/lu';

const IndexPageActionButtons = () => {
	const { userAddress } = useEthersStore();

	return (
		<div className="flex flex-col gap-2">
			{!userAddress && (
				<Button className="flex w-full gap-2" onClick={connectWallet}>
					<LuWallet />
					Connect your wallet
				</Button>
			)}

			{!!userAddress && (
				<Link href="/mint">
					<Button className="flex w-full gap-2">
						<LuHammer />
						Start minting
					</Button>
				</Link>
			)}

			<Link href="/search">
				<Button className="flex w-full gap-2">
					<LuSearch />
					Check out community created tokens
				</Button>
			</Link>
		</div>
	);
};

export default IndexPageActionButtons;

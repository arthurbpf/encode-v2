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
					Connect your wallet
					<LuWallet />
				</Button>
			)}

			{!!userAddress && (
				<Link href="/mint">
					<Button className="flex w-full gap-2">
						Start minting
						<LuHammer />
					</Button>
				</Link>
			)}

			<Link href="/search">
				<Button className="flex w-full gap-2">
					Check out community created tokens
					<LuSearch />
				</Button>
			</Link>
		</div>
	);
};

export default IndexPageActionButtons;

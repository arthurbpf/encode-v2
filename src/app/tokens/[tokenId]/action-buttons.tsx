'use client';

import { Button } from '@/components/ui/button';
import { TokenInfo } from '@/lib/ethers/types';
import { trimAddress } from '@/lib/ethers/utils';
import { useEthersStore } from '@/stores/ethers';
import { LuDollarSign, LuList, LuMegaphone, LuTrash } from 'react-icons/lu';

export default function TokenDetailsActionButtons({
	token
}: {
	token: TokenInfo;
}) {
	const { userAddress } = useEthersStore();
	const trimmedUserAddress = trimAddress(userAddress);

	return (
		<div className="flex gap-2">
			{token.owner === userAddress && (
				<Button variant={'confirmation'} className="flex gap-2">
					<LuMegaphone />
					List token for sale
				</Button>
			)}

			{token.owner === userAddress && token.sellingListing.price !== 0n && (
				<Button variant={'destructive'} className="flex gap-2">
					<LuTrash />
					Delete selling listing
				</Button>
			)}

			{token.owner !== userAddress && (
				<Button variant={'confirmation'} className="flex gap-2">
					<LuDollarSign />
					Make a bid!
				</Button>
			)}

			<Button className="flex gap-2">
				<LuList />
				View buying bids
			</Button>
		</div>
	);
}

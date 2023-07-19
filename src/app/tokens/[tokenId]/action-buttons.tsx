import { Button } from '@/components/ui/button';
import { TokenInfo } from '@/lib/ethers/types';
import { LuList, LuMegaphone, LuTrash } from 'react-icons/lu';

export default function TokenDetailsActionButtons({
	token
}: {
	token: TokenInfo;
}) {
	return (
		<div className="flex gap-2">
			<Button variant={'confirmation'} className="flex gap-2">
				<LuMegaphone />
				List token for sale
			</Button>
			<Button variant={'destructive'} className="flex gap-2">
				<LuTrash />
				Delete selling listing
			</Button>
			<Button className="flex gap-2">
				<LuList />
				View buying bids
			</Button>
		</div>
	);
}

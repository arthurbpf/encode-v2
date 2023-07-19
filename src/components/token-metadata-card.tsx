import { TokenInfo } from '@/lib/ethers/types';
import { formatDistance } from 'date-fns';
import { LuClock } from 'react-icons/lu';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from './ui/card';

export default function TokenMetadataCard({ token }: { token: TokenInfo }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between">
					<div className="line-clamp-1">
						# {token.id} - {token.metadata.title}
					</div>
				</CardTitle>
				<CardDescription className="line-clamp-1">
					{token.metadata.description}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>
					<span className="flex items-center justify-center gap-2 leading-7 [&:not(:first-child)]:mt-2">
						<LuClock />{' '}
						{formatDistance(token.creationDate, new Date()) + ' ago'}
					</span>
				</p>
			</CardContent>
		</Card>
	);
}

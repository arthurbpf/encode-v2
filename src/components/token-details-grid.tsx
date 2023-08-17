import { TokenInfo } from '@/lib/ethers/types';
import Link from 'next/link';

import TokenMetadataCard from './token-metadata-card';

const TokenDetailsGrid = ({ tokens }: { tokens: TokenInfo[] }) => {
	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{tokens.map((token) => (
				<Link key={token.id} href={`/tokens/${token.id}`}>
					<div className="transition-transform hover:scale-105">
						<TokenMetadataCard key={token.id} token={token} />
					</div>
				</Link>
			))}
		</div>
	);
};

export default TokenDetailsGrid;

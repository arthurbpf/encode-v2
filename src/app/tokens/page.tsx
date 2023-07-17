import TokenMetadataCard from '@/components/token-metadata-card';
import { Heading } from '@/components/ui/heading';
import { listTokens } from '@/lib/ethers/utils';

export default async function ListTokensPage() {
	const tokens = await listTokens();

	return (
		<div className="p-10 flex flex-col gap-8 flex-1">
			<Heading as="h1">Tokens created by the community!</Heading>

			<div>
				{tokens.map((token) => (
					<TokenMetadataCard key={token.id} token={token} />
				))}
			</div>
		</div>
	);
}

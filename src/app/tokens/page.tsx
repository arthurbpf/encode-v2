import TokenMetadataCard from '@/components/token-metadata-card';
import { Heading } from '@/components/ui/heading';
import { listTokens } from '@/lib/ethers/utils';
import Link from 'next/link';

// makes Next.js render this page every 0 seconds (when a request comes in)
export const revalidate = 0;

export default async function ListTokensPage() {
	const tokens = await listTokens();

	return (
		<main className="p-4 sm:p-8 md:p-10 flex flex-col gap-8 flex-1">
			<Heading as="h1">Tokens created by the community!</Heading>

			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{tokens.map((token) => (
					<Link key={token.id} href={`/tokens/${token.id}`}>
						<div className="transition-transform hover:scale-105">
							<TokenMetadataCard key={token.id} token={token} />
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}

import TokenDetailsGrid from '@/components/token-details-grid';
import { Heading } from '@/components/ui/heading';
import { listTokens } from '@/lib/ethers/utils';

// makes Next.js render this page every 0 seconds (when a request comes in)
export const revalidate = 0;

export default async function ListTokensPage() {
	const tokens = await listTokens();

	return (
		<main className="p-4 sm:p-8 md:p-10 flex flex-col gap-8 flex-1">
			<Heading as="h1">Tokens created by the community!</Heading>
			<TokenDetailsGrid tokens={tokens} />
		</main>
	);
}

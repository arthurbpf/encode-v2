import OffersTable from '@/components/offers-data-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { getBuyingRequests, getToken } from '@/lib/ethers/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft } from 'react-icons/lu';

export default async function OffersPage({
	params
}: {
	params: { tokenId: string };
}) {
	const buyingRequests = await getBuyingRequests({
		tokenId: Number(params.tokenId)
	});
	const tokenInfo = await getToken(Number(params.tokenId));

	if (!tokenInfo) {
		notFound();
	}

	return (
		<div className="flex-1 flex flex-col p-4 gap-6">
			<Heading as="h1">{`Offers for token #${params.tokenId}`}</Heading>

			<Link href={`/tokens/${params.tokenId}`}>
				<Button className="flex gap-2">
					<LuArrowLeft />
					{'Return to token details'}
				</Button>
			</Link>

			<OffersTable buyingRequests={buyingRequests} token={tokenInfo} />
		</div>
	);
}

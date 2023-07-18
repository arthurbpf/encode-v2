import { Heading } from '@/components/ui/heading';
import { getToken } from '@/lib/ethers/utils';
import { retrieveData } from '@/lib/ipfs/utils';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

async function fetchTokenInfo(tokenId: string) {
	const tokenInfo = await getToken(Number(tokenId));
	let textBody = '';

	if (typeof tokenInfo !== 'undefined') {
		textBody = await retrieveData(tokenInfo.uri);
	}

	return {
		tokenInfo,
		textBody
	};
}

export default async function TokenDetailsPage({
	params
}: {
	params: { tokenId: string };
}) {
	const { tokenInfo, textBody } = await fetchTokenInfo(params.tokenId);

	if (typeof tokenInfo === 'undefined') {
		notFound();
	}

	return (
		<main className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center gap-24 min-w-full ">
			<div className="flex flex-col gap-10 text-center">
				<Heading as="h1">{`#${tokenInfo.id} - ${tokenInfo.metadata.title}`}</Heading>
				<Heading as="h2">{tokenInfo.metadata.description}</Heading>
			</div>

			<div className="text-justify max-w-7xl">
				<MDXRemote source={textBody} />
			</div>
		</main>
	);
}

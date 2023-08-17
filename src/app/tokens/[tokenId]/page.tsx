import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { getToken, trimAddress } from '@/lib/ethers/utils';
import { retrieveData } from '@/lib/ipfs/utils';
import { MDXRemote } from 'next-mdx-remote/rsc';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { LuUser } from 'react-icons/lu';

const TokenDetailsActionButtons = dynamic(() => import('./action-buttons'), {
	ssr: false
});

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
		<main className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center gap-8 min-w-full ">
			<div className="flex flex-col gap-10 m-9 text-center">
				<Heading as="h1">{`#${tokenInfo.id} - ${tokenInfo.metadata.title}`}</Heading>
				<Heading as="h2">{tokenInfo.metadata.description}</Heading>
			</div>

			<div className="flex gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<Button className="flex gap-2" variant={'outline'}>
								<LuUser /> Owned by {trimAddress(tokenInfo.owner)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{tokenInfo.owner}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<TokenDetailsActionButtons token={tokenInfo} />

			<div className="text-justify max-w-7xl">
				<MDXRemote source={textBody} />
			</div>
		</main>
	);
}

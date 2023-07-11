import { Heading } from '@/components/ui/heading';
import Image from 'next/image';

import IndexPageActionButtons from './action-buttons';

export default function Home() {
	return (
		<main className="flex-1 flex flex-col items-center justify-center gap-24">
			<div className="flex flex-col items-center justify-center gap-2">
				<Image
					src="/logo.jpg"
					alt="Encode logo"
					width={200}
					height={200}
					className="rounded-2xl"
				/>
				<Heading as="h1">Encode</Heading>
			</div>

			<IndexPageActionButtons />
		</main>
	);
}

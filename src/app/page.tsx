import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import Image from 'next/image';
import { LuHammer, LuSearch, LuWallet } from 'react-icons/lu';

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
			<div className="flex flex-col gap-2">
				<Button className="flex gap-2">
					Connect your wallet <LuWallet />
				</Button>
				<Button className="flex gap-2">
					Start minting <LuHammer />
				</Button>
				<Button className="flex gap-2">
					Check out community created tokens <LuSearch />
				</Button>
			</div>
		</main>
	);
}

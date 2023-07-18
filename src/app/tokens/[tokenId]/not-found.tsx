import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { LuSearch } from 'react-icons/lu';

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-around flex-1">
			<div className="text-center">
				<Heading as="h1">Token not found</Heading>
				<p>We were unable to find the requested token</p>
			</div>

			<Link href="/tokens">
				<Button className="flex w-full gap-2">
					<LuSearch />
					Check out the tokens listing page!
				</Button>
			</Link>
		</div>
	);
}

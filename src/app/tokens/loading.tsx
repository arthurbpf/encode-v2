import { Heading } from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="p-4 sm:p-8 md:p-10 flex flex-col gap-8 flex-1">
			<Heading as="h1">Tokens created by the community!</Heading>

			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-cols-auto auto-rows-auto">
				{Array(9).fill(<Skeleton className="rounded min-w-full h-40" />)}
			</div>
		</div>
	);
}

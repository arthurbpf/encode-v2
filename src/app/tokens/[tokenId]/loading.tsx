import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<main className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center gap-24 min-w-full ">
			<div className="w-full flex flex-col items-center justify-center gap-10">
				<Skeleton className="w-2/3 h-10" />
				<Skeleton className="w-full h-10" />

				<Separator className="w-full" />
			</div>

			<div className="w-full h-full max-w-7xl flex-1 flex flex-col">
				<Skeleton className="w-full flex-1" />
			</div>
		</main>
	);
}

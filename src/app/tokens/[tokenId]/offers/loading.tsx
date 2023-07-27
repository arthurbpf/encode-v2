import { LuLoader2 } from 'react-icons/lu';

export default function Loading() {
	return (
		<div className="flex-1 flex items-center justify-center">
			<LuLoader2 className="mr-2 h-4 w-4 animate-spin" /> {'Loading offers...'}
		</div>
	);
}

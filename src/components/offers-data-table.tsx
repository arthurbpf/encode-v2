'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { BuyingRequest, TokenInfo } from '@/lib/ethers/types';
import { acceptBuyingRequest } from '@/lib/ethers/utils';
import { useEthersStore } from '@/stores/ethers';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { formatEther } from 'ethers';
import { FaEthereum } from 'react-icons/fa';

import { Button } from './ui/button';
import { toast } from './ui/use-toast';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const columns: ColumnDef<BuyingRequest>[] = [
	{ header: 'Buyer', accessorKey: 'buyer' },
	{
		header: 'Offer',
		accessorKey: 'offer',
		cell: ({ row }) => {
			const offer = row.getValue('offer') as bigint;
			const formatted = formatEther(offer);
			return (
				<div className="flex gap-1 items-center justify-end">
					{formatted} <FaEthereum />
				</div>
			);
		}
	},
	{
		header: 'Creation date',
		accessorKey: 'creationDate',
		cell: ({ row }) => {
			const date = row.getValue('creationDate') as Date;
			const formatted = formatDistance(date, new Date()) + ' ago';
			return formatted;
		}
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => {
			const status = row.getValue('status') as number;
			const formatted =
				status == 0 ? 'Pending' : status == 1 ? 'Accepted' : 'Rejected';
			return formatted;
		}
	}
];

async function onClickAcceptOffer({
	tokenId,
	offerId
}: {
	tokenId: number;
	offerId: number;
}) {
	try {
		toast({
			title: 'Accepting offer',
			description: 'Confirm your transaction in Metamask.'
		});
		const receipt = await acceptBuyingRequest({ tokenId, requestId: offerId });

		toast({
			title: 'Offer accepted',
			description: 'Offer has been accepted. Wait for Metamask confirmation.'
		});

		receipt.wait().then(() => {
			toast({
				title: 'Offer accepted',
				description: 'The token has been transfered to the buyer successfully.'
			});
		});
	} catch (e) {
		toast({
			title: 'Unable to accept offer',
			description:
				'We were unable to accept your offer. Please try again later.',
			variant: 'destructive'
		});
	}
}

const actionColumn: ColumnDef<BuyingRequest> = {
	id: 'action',
	header: 'Action',
	accessorKey: 'action',
	cell: ({ row }) => {
		const offer = row.original;
		const { tokenId, id: offerId } = offer;
		return (
			<Button
				onClick={() => {
					onClickAcceptOffer({ tokenId, offerId });
				}}
			>
				Accept
			</Button>
		);
	}
};

function DataTable<TData, TValue>({
	columns,
	data
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default async function OffersTable({
	token,
	buyingRequests
}: {
	token: TokenInfo;
	buyingRequests: BuyingRequest[];
}) {
	const { userAddress } = useEthersStore();
	let finalColumns = [...columns];
	if (userAddress == token.owner) {
		finalColumns.push(actionColumn);
	}

	return <DataTable columns={finalColumns} data={buyingRequests} />;
}

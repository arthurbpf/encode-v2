'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { TokenInfo } from '@/lib/ethers/types';
import { trimAddress } from '@/lib/ethers/utils';
import { useEthersStore } from '@/stores/ethers';
import { useState } from 'react';
import { LuDollarSign, LuList, LuMegaphone, LuTrash } from 'react-icons/lu';

function SellTokenDialog() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'confirmation'} className="flex gap-2">
					<LuMegaphone />
					List token for sale
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{'List token for sale'}</DialogTitle>
					<DialogDescription>
						{
							'This will make your token available for immediate purchase for the value specified.'
						}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button variant={'secondary'} onClick={() => setDialogOpen(false)}>
						{'Cancel'}
					</Button>
					<Button onClick={() => setDialogOpen(false)}>{'Post listing'}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function CancelSellingDialog() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'destructive'} className="flex gap-2">
					<LuTrash />
					Delete selling listing
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]"></DialogContent>
		</Dialog>
	);
}

function BidDialog() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'confirmation'} className="flex gap-2">
					<LuDollarSign />
					Make a bid!
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]"></DialogContent>
		</Dialog>
	);
}

function ListBidSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="flex gap-2">
					<LuList />
					View buying bids
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader>
					<SheetTitle>Bids for this token</SheetTitle>
					<SheetDescription>
						These are the bids that have been made for this token.
					</SheetDescription>
				</SheetHeader>
				<ScrollArea>
					<div className="grid p-6"></div>
					<ScrollBar />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}

export default function TokenDetailsActionButtons({
	token
}: {
	token: TokenInfo;
}) {
	const { userAddress } = useEthersStore();
	const trimmedUserAddress = trimAddress(userAddress);

	return (
		<div className="flex gap-2">
			{token.owner === userAddress && <SellTokenDialog />}

			{token.owner === userAddress && token.sellingListing.price !== 0n && (
				<CancelSellingDialog />
			)}

			{token.owner !== userAddress && <BidDialog />}

			<ListBidSheet />
		</div>
	);
}

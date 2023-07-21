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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuDollarSign, LuList, LuMegaphone, LuTrash } from 'react-icons/lu';
import * as z from 'zod';

function SellTokenDialog() {
	const [dialogOpen, setDialogOpen] = useState(false);

	const formSchema = z.object({
		price: z
			.string({
				required_error: 'Price is required'
			})
			.transform((val) => Number(val))
			.pipe(z.number().min(0, 'Price must be greater than 0'))
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema)
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
		} catch (e) {
			console.error(e);
		}
	}

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
							'This will make your token available for immediate purchase for the amout of ether specified.'
						}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="price"
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
									<FormDescription>Amount in ether</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="mt-4">
							<Button
								variant={'secondary'}
								onClick={() => setDialogOpen(false)}
							>
								{'Cancel'}
							</Button>
							<Button type="submit">{'Post listing'}</Button>
						</DialogFooter>
					</form>
				</Form>
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

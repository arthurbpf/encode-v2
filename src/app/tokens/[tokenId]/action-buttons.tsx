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
import { useToast } from '@/components/ui/use-toast';
import { TokenInfo } from '@/lib/ethers/types';
import {
	buyToken,
	cancelSellingListing,
	createBuyingRequest,
	createSellingListing
} from '@/lib/ethers/utils';
import { useEthersStore } from '@/stores/ethers';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatEther } from 'ethers';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEthereum } from 'react-icons/fa';
import {
	LuDollarSign,
	LuList,
	LuLoader2,
	LuMegaphone,
	LuShoppingCart,
	LuTrash
} from 'react-icons/lu';
import * as z from 'zod';

function SellTokenDialog({ token }: { token: TokenInfo }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

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
			setIsLoading(true);
			toast({
				title: 'Transaction initiated',
				description: 'Confirm your transaction in Metamask.'
			});

			const response = await createSellingListing({
				tokenId: token.id,
				amount: values.price
			});

			toast({
				title: 'Selling listing created',
				description:
					'Your listing transaction has been created, wait for Metamask to confirm it.'
			});

			response.wait().then(() => {
				toast({
					title: 'Selling listing created',
					description: 'Your listing transaction has been confirmed.'
				});
			});

			form.reset();
			setIsLoading(false);
			setDialogOpen(false);
		} catch (e) {
			setIsLoading(false);

			toast({
				title: 'Error!',
				description:
					'An error occured while creating your listing, please try again later.',
				variant: 'destructive'
			});
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'confirmation'} className="flex gap-2">
					<LuMegaphone />
					{token.sellingListing.price > 0n
						? 'Edit listing price'
						: 'List token for sale'}
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
								type="button"
								disabled={isLoading}
								onClick={() => setDialogOpen(false)}
							>
								{'Cancel'}
							</Button>
							<Button type="submit" disabled={isLoading} className="flex gap-2">
								{isLoading ? (
									<>
										<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
										{'Posting your listing'}
									</>
								) : (
									'Post listing'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function CancelSellingDialog({ token }: { token: TokenInfo }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	async function onClickDeleteListing() {
		try {
			setIsLoading(true);
			toast({
				title: 'Transaction initiated',
				description: 'Confirm your transaction in Metamask.'
			});

			const response = await cancelSellingListing({ tokenId: token.id });

			toast({
				title: 'Selling listing canceled',
				description:
					'Your listing transaction has been canceled, wait for Metamask to confirm it.'
			});

			response.wait().then(() => {
				toast({
					title: 'Selling listing canceled',
					description: 'Your cancelation transaction has been confirmed.'
				});
			});

			setIsLoading(false);
			setDialogOpen(false);
		} catch (e) {
			setIsLoading(false);
			console.error(e);
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'destructive'} className="flex gap-2">
					<LuTrash />
					{'Cancel listing'}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{'Cancel the listing for this token'}</DialogTitle>
					<DialogDescription>
						{'This token will no longer be available for immediate purchase!'}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="mt-4">
					<Button
						variant={'secondary'}
						type="button"
						disabled={isLoading}
						onClick={() => setDialogOpen(false)}
					>
						{'Cancel'}
					</Button>
					<Button
						onClick={onClickDeleteListing}
						type="submit"
						disabled={isLoading}
						className="flex gap-2"
					>
						{isLoading ? (
							<>
								<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
								{'Cancel the listing'}
							</>
						) : (
							<>
								<LuTrash />
								{'Cancel listing'}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function BuyTokenDialog({ token }: { token: TokenInfo }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	async function onClickBuyToken() {
		try {
			setIsLoading(true);
			toast({
				title: 'Transaction initiated',
				description: 'Confirm your transaction in Metamask.'
			});

			const response = await buyToken({
				tokenId: token.id,
				amount: token.sellingListing.price
			});

			toast({
				title: 'Transaction sent',
				description:
					'Your transaction transaction has been sent, wait for Metamask to confirm it.'
			});

			response.wait().then(() => {
				toast({
					title: 'Transaction confirmed',
					description:
						'Your transaction transaction has been confirmed. The token is now yours!'
				});
			});

			setIsLoading(false);
			setDialogOpen(false);
		} catch (e) {
			setIsLoading(false);
			console.error(e);
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'confirmation'} className="flex gap-2">
					<LuShoppingCart />
					{'Buy token'}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{'Buy this token immediately'}</DialogTitle>
					<DialogDescription>
						{'This token will be bought for the amout specified below'}
					</DialogDescription>
				</DialogHeader>

				<div className="w-full text-2xl flex gap-2 items-center justify-center">
					{formatEther(token.sellingListing.price)}
					<FaEthereum />
				</div>

				<DialogFooter className="mt-4">
					<Button
						variant={'secondary'}
						type="button"
						disabled={isLoading}
						onClick={() => setDialogOpen(false)}
					>
						{'Cancel'}
					</Button>
					<Button
						onClick={onClickBuyToken}
						type="submit"
						disabled={isLoading}
						className="flex gap-2"
					>
						{isLoading ? (
							<>
								<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
								{'Buying the token'}
							</>
						) : (
							<>
								<LuShoppingCart />
								{'Buy token'}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function BidDialog({ token }: { token: TokenInfo }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

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
			setIsLoading(true);
			toast({
				title: 'Transaction initiated',
				description: 'Confirm your transaction in Metamask.'
			});

			const response = await createBuyingRequest({
				tokenId: token.id,
				amount: values.price
			});

			toast({
				title: 'Buying request created',
				description:
					'Your buying request transaction has been created, wait for Metamask to confirm it.'
			});

			response.wait().then(() => {
				toast({
					title: 'Buying request created',
					description: 'Your buying request transaction has been confirmed.'
				});
			});

			form.reset();
			setIsLoading(false);
			setDialogOpen(false);
		} catch (e) {
			setIsLoading(false);

			toast({
				title: 'Error!',
				description:
					'An error occured while creating your buying request, please try again later.',
				variant: 'destructive'
			});
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'confirmation'} className="flex gap-2">
					<LuDollarSign />
					{'Make a bid!'}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{'Make a offer to the seller'}</DialogTitle>
					<DialogDescription className="text-justify">
						{
							'This will transfer the amount specified to the contract. If the seller accepts your offer, the amount held by the contract will be traded for the ownership of this token, otherwise, your funds will be returned to you.'
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
								type="button"
								disabled={isLoading}
								onClick={() => setDialogOpen(false)}
							>
								{'Cancel'}
							</Button>
							<Button type="submit" disabled={isLoading} className="flex gap-2">
								{isLoading ? (
									<>
										<LuLoader2 className="mr-2 h-4 w-4 animate-spin" /> Posting
										your listing
									</>
								) : (
									'Make offer'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

async function ListBidDialog({ token }: { token: TokenInfo }) {
	return (
		<Link href={`/tokens/${token.id}/offers`}>
			<Button variant={'secondary'} className="flex gap-2">
				<LuList />
				View buying bids
			</Button>
		</Link>
	);
}

export default function TokenDetailsActionButtons({
	token
}: {
	token: TokenInfo;
}) {
	const { userAddress } = useEthersStore();

	return (
		<div className="flex gap-2">
			{token.owner === userAddress && <SellTokenDialog token={token} />}

			{token.owner === userAddress && token.sellingListing.price !== 0n && (
				<CancelSellingDialog token={token} />
			)}

			{token.owner !== userAddress && token.sellingListing.price > 0n && (
				<BuyTokenDialog token={token} />
			)}

			{token.owner !== userAddress && <BidDialog token={token} />}

			<ListBidDialog token={token} />
		</div>
	);
}

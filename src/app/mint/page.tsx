'use client';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { mintToken } from '@/lib/ethers/utils';
import { sendData } from '@/lib/ipfs/utils';
import { useEthersStore } from '@/stores/ethers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuHammer, LuLoader2 } from 'react-icons/lu';
import * as z from 'zod';

export default function MintPage() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const { userAddress } = useEthersStore();

	const formSchema = z.object({
		title: z.string().min(3).max(75),
		description: z.string().min(3).max(200),
		textBody: z.string().min(50)
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			textBody: ''
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const uri = await sendData(values);

			toast({
				title: 'Data sent to IPFS',
				description:
					'Your data has been sent to IPFS, accepting the transaction on Metamask will mint your token.'
			});

			await mintToken({
				address: userAddress,
				title: values.title,
				description: values.description,
				uri
			});

			toast({
				title: 'Transaction sent',
				description:
					'Your transaction has been sent to the blockchain, please wait for it to be completed.'
			});

			form.reset();
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			toast({
				title: 'Unable to mint token',
				description:
					'An error occured while minting your token, please try again later.',
				variant: 'destructive'
			});
		}
	}

	return (
		<Form {...form}>
			<form
				className="p-10 flex flex-col gap-8 flex-1"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex gap-8 justify-between">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="A very cool article" {...field} />
								</FormControl>
								<FormDescription>
									{'Your article title should be between 3 and 75 characters.'}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input
										placeholder="This cool article is all about..."
										{...field}
									/>
								</FormControl>
								<FormDescription>
									{
										'Your article description should be between 3 and 200 characters.'
									}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="textBody"
					render={({ field }) => (
						<FormItem className="flex-1 flex flex-col">
							<FormLabel>Text body</FormLabel>
							<FormControl>
								<Textarea
									className="flex-1"
									placeholder="Once upon a time..."
									{...field}
								/>
							</FormControl>
							<FormDescription>
								{'Your article body should be at least 50 characters.'}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} className="flex gap-2" type="submit">
					{isLoading ? (
						<>
							<LuLoader2 className="mr-2 h-4 w-4 animate-spin" /> Minting your
							token
						</>
					) : (
						<>
							<LuHammer /> Mint
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}

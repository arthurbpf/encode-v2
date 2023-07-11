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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LuHammer } from 'react-icons/lu';
import * as z from 'zod';

export default function MintPage() {
	const formSchema = z.object({
		title: z.string().min(3).max(75),
		description: z.string().min(3).max(200),
		textBody: z.string().min(50)
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema)
	});

	function onSubmit(values: z.infer<typeof formSchema>) {}

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

				<Button className="flex gap-2" type="submit">
					Mint <LuHammer />
				</Button>
			</form>
		</Form>
	);
}

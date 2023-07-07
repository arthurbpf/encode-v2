'use client';

import { isMetamaskInstalled } from '@/lib/ethers/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from './ui/alert-dialog';

const InstallMetamaskDialog = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(!isMetamaskInstalled());
	}, []);

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{"It seems you don't have Metamask installed!"}
					</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-col items-center justify-center">
						<Image
							src="/metamask.svg"
							alt="Metamask logo"
							width={250}
							height={250}
						/>

						<p className="mb-10">
							{
								"Without Metamask, you won't be able to fully interact with the application."
							}
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<a target="_blank" href={'https://metamask.io/'}>
						<AlertDialogAction>Download it here!</AlertDialogAction>
					</a>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Ok, I understand.
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default InstallMetamaskDialog;

import InstallMetamaskDialog from '@/components/install-metamask-dialog';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';

import './globals.css';

export const metadata = {
	title: 'Encode',
	description:
		'Encode is a dapp that allows you to store your articles on the blockchain.'
};

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter'
});

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.variable} font-sans`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="min-h-screen p-2 flex flex-col">
						<Navbar />
						<InstallMetamaskDialog />
						{children}
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}

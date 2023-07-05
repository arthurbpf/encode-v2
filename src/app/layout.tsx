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
			<body className={`${inter.variable} font-sans p-2`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Navbar />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

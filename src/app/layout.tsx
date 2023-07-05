import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';

import './globals.css';

export const metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app'
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
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

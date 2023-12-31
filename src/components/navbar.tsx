'use client';

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { setAccountsChangedEvent } from '@/lib/ethers/events';
import { useEthersStore } from '@/stores/ethers';
import Link from 'next/link';
import { useEffect } from 'react';

import { ModeToggle } from './dark-mode-toggle';
import WalletAvatar from './wallet-avatar';

const Navbar = () => {
	const { userAddress } = useEthersStore();
	useEffect(() => {
		setAccountsChangedEvent();
	}, []);

	return (
		<div className="flex justify-between">
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Home
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					{userAddress && (
						<NavigationMenuItem>
							<Link href="/mint" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Mint
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					)}
					<NavigationMenuItem>
						<Link href="/tokens" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Tokens
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div className="flex gap-2">
				<ModeToggle />
				<WalletAvatar />
			</div>
		</div>
	);
};

export default Navbar;

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
import Link from 'next/link';
import { useEffect } from 'react';

import { ModeToggle } from './dark-mode-toggle';

const Navbar = () => {
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
					<NavigationMenuItem>
						<Link href="/mint" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Mint
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/tokens" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Tokens
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<ModeToggle />
		</div>
	);
};

export default Navbar;
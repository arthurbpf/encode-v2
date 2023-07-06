import { setUserAddress } from '@/stores/ethers';
import { BigNumberish, ethers, parseEther } from 'ethers';

import abi from './Encode.json';

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

function cleanArray<T>(array: T[]): T[] {
	return array.length === 1 && array[0] === 0 ? [] : array;
}

export function isMetaMaskInstalled() {
	return window && window.ethereum;
}

export function getProvider() {
	try {
		let provider = new ethers.BrowserProvider(window.ethereum);

		return provider;
	} catch (e) {
		console.error('MetaMask not found!');
	}
}

export async function getConnectedAccounts() {
	const provider = getProvider();

	if (provider) {
		return await provider.listAccounts();
	}

	return [];
}

export async function isConnected() {
	const accounts = await getConnectedAccounts();

	return accounts.length > 0;
}

export async function getPrimaryAccountAddress() {
	const accounts = await getConnectedAccounts();

	const address = (await accounts[0]?.getAddress()) || '';

	setUserAddress(address);
	return address;
}

export async function connectWallet() {
	try {
		const { ethereum } = window;

		if (!ethereum) {
			alert('MetaMask encontrada!');
			return;
		}

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

		setUserAddress(await getPrimaryAccountAddress());
	} catch (error) {
		console.error(error);
	}
}

interface getEncodeContractParams {
	signed?: boolean;
}

export async function getEncodeContract({
	signed = true
}: getEncodeContractParams) {
	const provider = getProvider();

	if (provider) {
		const signer = signed ? await provider.getSigner() : provider;

		return new ethers.Contract(contractAddress, abi.abi, signer);
	}
}

interface mintTokenParams {
	address: string;
	uri: string;
	title: string;
	description: string;
}

export async function mintToken({
	address,
	uri,
	title,
	description
}: mintTokenParams) {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = contract.safeMint(address, uri, title, description);
		await tx;
	} else {
		throw new Error('Contract not found!');
	}
}

export interface TokenInfo {
	id: number;
	uri: string;
	title: string;
	owner?: string;
	description: string;
	creationDate: Date;
	sellingListing: {
		price: BigNumberish;
		creationDate: Date;
	};
}

export async function getTokensOfOwner(address: string): Promise<TokenInfo[]> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (contract) {
			const tokens = await contract.getTokensOfOwner(address);

			if (tokens.length === 0) return [];

			return tokens.map((token: any) => ({
				id: Number(token.id),
				uri: token.uri,
				creationDate: new Date(Number(token.metadata.creationDate) * 1000),
				title: token.metadata.title,
				description: token.metadata.description,
				sellingListing: {
					price: BigInt(token.sellingListing.price),
					creationDate: new Date(
						Number(token.sellingListing.creationDate) * 1000
					)
				}
			}));
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getTokenById(id: number): Promise<TokenInfo> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (id < 0 || isNaN(id)) throw new Error('Invalid id!');

		if (contract) {
			const token = await contract.getToken(BigInt(id));

			return {
				id: Number(token.id),
				uri: token.uri,
				creationDate: new Date(Number(token.metadata.creationDate) * 1000),
				owner: token.owner,
				title: token.metadata.title,
				description: token.metadata.description,
				sellingListing: {
					price: BigInt(token.sellingListing.price),
					creationDate: new Date(
						Number(token.sellingListing.creationDate) * 1000
					)
				}
			};
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
		return {} as TokenInfo;
	}
}

export async function listTokens(): Promise<TokenInfo[]> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (contract) {
			const tokens = await contract.listTokens();

			return cleanArray(
				tokens.map((token: any) => ({
					id: Number(token.id),
					uri: token.uri,
					creationDate: new Date(Number(token.metadata.creationDate) * 1000),
					owner: token.owner,
					title: token.metadata.title,
					description: token.metadata.description,
					sellingListing: {
						price: BigInt(token.sellingListing.price),
						creationDate: new Date(
							Number(token.sellingListing.creationDate) * 1000
						)
					}
				}))
			);
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

interface CreateBuyingRequestParams {
	amount: number;
	tokenId: number;
}

export async function createBuyingRequest({
	tokenId,
	amount
}: CreateBuyingRequestParams) {
	const contract = await getEncodeContract({ signed: true });
	if (contract) {
		const tx = contract.createBuyingRequest(tokenId, {
			value: parseEther(amount.toString())
		});
		await tx;
	} else {
		throw new Error('Contract not found!');
	}
}

export interface BuyingRequest {
	id: number;
	buyer: string;
	offer: BigNumberish;
	creationDate: Date;
	status: number;
}

interface GetBuyingRequestsParams {
	tokenId: number;
}

export async function getBuyingRequests({
	tokenId
}: GetBuyingRequestsParams): Promise<BuyingRequest[]> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (contract) {
			const requests = await contract.getBuyingRequests(tokenId);

			return cleanArray(
				requests.map((request: any) => ({
					id: Number(request.id),
					buyer: request.buyer,
					offer: request.offer,
					creationDate: new Date(Number(request.timestamp) * 1000),
					status: request.status
				}))
			);
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

interface AcceptBuyingRequestParams {
	tokenId: number;
	requestId: number;
}

export async function acceptBuyingRequest({
	tokenId,
	requestId
}: AcceptBuyingRequestParams) {
	const contract = await getEncodeContract({ signed: true });

	try {
		if (contract) {
			const tx = contract.acceptBuyingRequest(tokenId, requestId);
			await tx;
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
	}
}

interface CancelBuyingRequestParams {
	tokenId: number;
	requestId: number;
}

export async function cancelBuyingRequest({
	tokenId,
	requestId
}: CancelBuyingRequestParams) {
	const contract = await getEncodeContract({ signed: true });

	try {
		if (contract) {
			const tx = contract.cancelBuyingRequest(tokenId, requestId);
			await tx;
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
	}
}

interface CreateSellingListingParams {
	tokenId: number;
	amount: number;
}

export async function createSellingListing({
	tokenId,
	amount
}: CreateSellingListingParams) {
	const contract = await getEncodeContract({ signed: true });

	try {
		if (contract) {
			const tx = contract.createSellingListing(
				tokenId,
				parseEther(amount.toString())
			);
			await tx;
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
	}
}

interface CancelSellingListingParams {
	tokenId: number;
}

export async function cancelSellingListing({
	tokenId
}: CancelSellingListingParams) {
	const contract = await getEncodeContract({ signed: true });

	try {
		if (contract) {
			const tx = contract.cancelSellingListing(tokenId);
			await tx;
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
	}
}

interface BuyTokenParams {
	tokenId: number;
	amount: BigNumberish;
}

export async function buyToken({ tokenId, amount }: BuyTokenParams) {
	const contract = await getEncodeContract({ signed: true });

	try {
		if (contract) {
			const tx = contract.buyToken(tokenId, { value: amount });
			await tx;
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
	}
}

export interface SellingListing {
	price: BigNumberish;
	creationDate: Date;
}

interface GetSellingListingParams {
	tokenId: number;
}

export async function getSellingListing({
	tokenId
}: GetSellingListingParams): Promise<SellingListing> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (contract) {
			const listing = await contract.getSellingListing(tokenId);
			return {
				price: BigInt(listing.price),
				creationDate: new Date(Number(listing.timestamp) * 1000)
			};
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		return {} as SellingListing;
	}
}

export function shortenAddress(address: string) {
	return (
		address.substring(0, 5) +
		'...' +
		address.substring(address.length - 4, address.length)
	);
}

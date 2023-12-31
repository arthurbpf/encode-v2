import {
	AlchemyProvider,
	BrowserProvider,
	Contract,
	TransactionResponse,
	parseEther
} from 'ethers';

import encodeContractAbi from './Encode.json';
import { BuyingRequest, TokenInfo } from './types';

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

function cleanArray<T>(array: T[]): T[] {
	return array.length === 1 && array[0] === 0 ? [] : array;
}

export function isMetamaskInstalled() {
	return typeof window !== 'undefined' && !!window && !!window.ethereum;
}

export function getAlchemyProvider() {
	try {
		let provider = new AlchemyProvider('sepolia', process.env.ALCHEMY_API_KEY);
		return provider;
	} catch (e) {}
}

export function getBrowserProvider() {
	try {
		if (!isMetamaskInstalled() || window.ethereum === undefined)
			throw new Error('MetaMask not found!');

		let provider = new BrowserProvider(window.ethereum);

		return provider;
	} catch (e) {
		console.error(e);
	}
}

export async function connectWallet() {
	try {
		if (!window.ethereum) {
			alert('MetaMask was not found!');
			return;
		}

		await window.ethereum.request({ method: 'eth_requestAccounts' });
	} catch (error) {
		console.error(error);
	}
}

export async function getConnectedAccounts() {
	const provider = getBrowserProvider();

	if (provider) {
		return await provider.listAccounts();
	}

	return [];
}

export async function isConnected() {
	const accounts = await getConnectedAccounts();

	return accounts.length > 0;
}

export async function getCurrentAccountAddress() {
	const accounts = await getConnectedAccounts();
	const address = (await accounts[0]?.getAddress()) || '';

	return address;
}

export function trimAddress(address: string) {
	if (!address) return '';

	return (
		address.substring(0, 5) +
		'...' +
		address.substring(address.length - 4, address.length)
	);
}

type GetProviderType<T extends boolean> = T extends true ? true : boolean;

interface getEncodeContractParams {
	signed?: boolean;
	browserProvider?: GetProviderType<boolean>;
}

export async function getEncodeContract({
	signed = false,
	browserProvider = true
}: getEncodeContractParams) {
	let provider;
	if (browserProvider) {
		provider = getBrowserProvider();
		if (provider && signed) {
			provider = await provider.getSigner();
		}
	} else {
		provider = getAlchemyProvider();
	}

	return new Contract(contractAddress, encodeContractAbi.abi, provider);
}

export async function getEncodeAlchemyContract() {
	const provider = getAlchemyProvider();

	return new Contract(contractAddress, encodeContractAbi.abi, provider);
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
}: mintTokenParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = await contract.safeMint(address, uri, title, description);
		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

export async function listTokens(): Promise<TokenInfo[]> {
	const contract = await getEncodeAlchemyContract();

	try {
		if (contract) {
			const tokens = await contract.listTokens();

			return cleanArray(
				tokens.map((token: any) => ({
					id: Number(token.id),
					uri: token.uri,
					creationDate: new Date(Number(token.metadata.creationDate) * 1000),
					owner: token.owner,
					metadata: {
						title: token.metadata.title,
						description: token.metadata.description
					},
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

export async function getTokensOfOwner(address: string): Promise<TokenInfo[]> {
	const contract = await getEncodeAlchemyContract();

	try {
		if (contract) {
			const tokens = await contract.getTokensOfOwner(address);

			if (tokens.length === 0) return [];

			return cleanArray(
				tokens.map((token: any) => ({
					id: Number(token.id),
					uri: token.uri,
					creationDate: new Date(Number(token.metadata.creationDate) * 1000),
					owner: token.owner,
					metadata: {
						title: token.metadata.title,
						description: token.metadata.description
					},
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

export async function getToken(id: number): Promise<TokenInfo | undefined> {
	const contract = await getEncodeAlchemyContract();

	try {
		if (id < 0 || isNaN(id)) throw new Error('Invalid id!');

		if (contract) {
			const token = await contract.getToken(BigInt(id));

			return {
				id: Number(token.id),
				uri: token.uri,
				creationDate: new Date(Number(token.metadata.creationDate) * 1000),
				owner: token.owner,
				metadata: {
					title: token.metadata.title,
					description: token.metadata.description
				},
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
	}
}

// Selling listings

interface CreateSellingListingParams {
	tokenId: number;
	amount: number;
}

export async function createSellingListing({
	tokenId,
	amount
}: CreateSellingListingParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = await contract.createSellingListing(
			tokenId,
			parseEther(amount.toString())
		);

		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

interface CancelSellingListingParams {
	tokenId: number;
}

export async function cancelSellingListing({
	tokenId
}: CancelSellingListingParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = await contract.cancelSellingListing(tokenId);

		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

interface BuyTokenParams {
	tokenId: number;
	amount: bigint;
}

export async function buyToken({
	tokenId,
	amount
}: BuyTokenParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = await contract.buyToken(tokenId, { value: amount });
		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

// Buying bids

interface CreateBuyingRequestParams {
	amount: number;
	tokenId: number;
}

export async function createBuyingRequest({
	tokenId,
	amount
}: CreateBuyingRequestParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });
	if (contract) {
		const tx = await contract.createBuyingRequest(tokenId, {
			value: parseEther(amount.toString())
		});
		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

interface GetBuyingRequestsParams {
	tokenId: number;
}

export async function getBuyingRequests({
	tokenId
}: GetBuyingRequestsParams): Promise<BuyingRequest[]> {
	const contract = await getEncodeAlchemyContract();

	try {
		if (contract) {
			const requests = await contract.getBuyingRequests(tokenId);

			return cleanArray(
				requests.map((request: any) => ({
					id: Number(request.id),
					tokenId,
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
}: AcceptBuyingRequestParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = await contract.acceptBuyingRequest(tokenId, requestId);
		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

interface CancelBuyingRequestParams {
	tokenId: number;
	requestId: number;
}

export async function cancelBuyingRequest({
	tokenId,
	requestId
}: CancelBuyingRequestParams): Promise<TransactionResponse> {
	const contract = await getEncodeContract({ signed: true });

	if (contract) {
		const tx = await contract.cancelBuyingRequest(tokenId, requestId);
		return tx;
	} else {
		throw new Error('Contract not found!');
	}
}

/*
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
*/

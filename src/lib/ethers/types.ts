interface TokenMetadata {
	title: string;
	description: string;
}

interface SellingListing {
	price: bigint;
	creationDate: Date;
}

interface BuyingRequest {}

export interface TokenInfo {
	id: number;
	creationDate: Date;
	uri: string;
	owner: string;
	metadata: TokenMetadata;
	sellingListing: SellingListing;
}

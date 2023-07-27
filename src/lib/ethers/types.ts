interface TokenMetadata {
	title: string;
	description: string;
}

interface SellingListing {
	price: bigint;
	creationDate: Date;
}

enum BuyingRequestStatus {
	Pending,
	Accepted,
	Rejected
}

export const BuyingRequestStatusLabel: {
	[key in BuyingRequestStatus]: string;
} = {
	[BuyingRequestStatus.Pending]: 'Pending',
	[BuyingRequestStatus.Accepted]: 'Accepted',
	[BuyingRequestStatus.Rejected]: 'Rejected'
};

export interface BuyingRequest {
	id: number;
	buyer: string;
	offer: bigint;
	creationDate: Date;
	status: BuyingRequestStatus;
}

export interface TokenInfo {
	id: number;
	creationDate: Date;
	uri: string;
	owner: string;
	metadata: TokenMetadata;
	sellingListing: SellingListing;
}

declare namespace NodeJS {
	export interface ProcessEnv {
		readonly NEXT_PUBLIC_CONTRACT_ADDRESS: string;
		readonly ALCHEMY_API_KEY: string;

		readonly NEXT_PUBLIC_IPFS_API_URL: string;
		readonly PINATA_API_KEY: string;
		readonly PINATA_SECRET_API_KEY: string;
	}
}

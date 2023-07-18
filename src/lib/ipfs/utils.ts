import { IpfsTokenData } from './types';

export async function sendData(data: IpfsTokenData) {
	const response = await fetch('/ipfs', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	const { cid } = await response.json();

	return cid as string;
}

export async function retrieveData(hash: string) {
	if (!hash) {
		return '';
	}

	const response = await fetch(`${ipfsBaseUrl}${hash}`);
	const data = (await response.json()) as IpfsTokenData;

	return data.textBody;
}

export const ipfsBaseUrl = 'https://ipfs.io/ipfs/';

import { toUtf8String } from 'ethers';
import { create } from 'ipfs-http-client';

export async function sendData(data: any) {
	const response = await fetch('/api/ipfs', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain'
		},
		body: data
	});

	const { uri } = await response.json();

	return uri.IpfsHash as string;
}

export async function retrieveData(hash: string) {
	if (!hash) {
		return '';
	}

	const response = await fetch(`${ipfsBaseUrl}${hash}`);
	const data = await response.json();

	return data.text;
}

export const ipfsBaseUrl = 'https://ipfs.io/ipfs/';

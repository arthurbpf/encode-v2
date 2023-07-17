export async function sendData(data: any) {
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
	const data = await response.json();

	return data.text;
}

export const ipfsBaseUrl = 'https://ipfs.io/ipfs/';

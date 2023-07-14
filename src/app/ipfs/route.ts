import pinataSDK from '@pinata/sdk';

export async function POST(request: Request) {
	const data = await request.json();
	const pinata = new pinataSDK({
		pinataApiKey: process.env.PINATA_API_KEY,
		pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
	});

	const { IpfsHash } = await pinata.pinJSONToIPFS(data);

	const response = new Response(JSON.stringify({ cid: IpfsHash }));

	return response;
}

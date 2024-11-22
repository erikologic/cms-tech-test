import { getUserId } from '@/cms/cms';

function generateToken(id: number) {
	return id;
}

export async function POST(request: Request) {
	let token;
	try {
		const { name } = await request.json();
		const id = await getUserId(name);
		token = generateToken(id);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return new Response(error.message, {
			status: 500,
		});
	}
	return Response.json(
		{ data: { token } },
		{
			status: 200,
			headers: {
				'Set-Cookie': `token=${token}; Path=/; HttpOnly`,
			},
		},
	);
}

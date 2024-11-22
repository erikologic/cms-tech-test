import { listLayers } from '@/cms/cms';
import { NextRequest } from 'next/server';

function decode(token: string | null): number {
	return Number(token);
}

export async function listLayersFromToken(
	token: string | null,
	bookId: number,
) {
	const userId = decode(token);
	return await listLayers({ userId, bookId });
}

export async function GET(request: NextRequest) {
	let layers;
	try {
		const token = request.headers.get('Authorization');
		const searchParams = request.nextUrl.searchParams;
		const bookId = searchParams.get('bookId');
		if (!bookId) {
			throw new Error('bookId is required');
		}
		layers = await listLayersFromToken(token, Number(bookId));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return new Response(error.message, {
			status: 500,
		});
	}
	return Response.json({ data: { books: layers } });
}

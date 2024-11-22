import { getBook } from '@/cms/cms';

function decode(token: string | null): number {
	return Number(token);
}

export async function getBookWithToken(token: string | null, bookId: number) {
	const userId = decode(token);
	return await getBook({ userId, bookId });
}

import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	let book;
	try {
		const token = request.headers.get('Authorization');
		const searchParams = request.nextUrl.searchParams;
		const bookId = searchParams.get('bookId');
		if (!bookId) {
			throw new Error('bookId is required');
		}
		book = await getBookWithToken(token, Number(bookId));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return new Response(error.message, {
			status: 500,
		});
	}
	return Response.json({ data: { book } });
}

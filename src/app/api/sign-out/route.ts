import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const cookieStore = await cookies();
	cookieStore.delete('token');
	const origin = request.nextUrl.origin;
	return Response.redirect(origin);
}

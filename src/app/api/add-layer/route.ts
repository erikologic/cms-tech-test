import { addLayer } from '@/cms/cms';
import { z } from 'zod';

function decode(token: string | null): number {
	return Number(token);
}

export const addLayerPayloadSchema = z.object({
	layerName: z.string(),
	bookId: z.number(),
	values: z.array(z.string()).min(1).max(26),
});

export async function POST(request: Request) {
	let layerId;
	try {
		const token = request.headers.get('Authorization');
		const userId = decode(token);
		const { layerName, bookId, values } = addLayerPayloadSchema.parse(
			await request.json(),
		);

		layerId = await addLayer({ bookId, userId, layerName, values });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return new Response(error.message, {
			status: 500,
		});
	}
	return Response.json({ data: { layerId } });
}

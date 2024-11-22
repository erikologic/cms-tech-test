import { displayBookAtLayer } from "@/cms/cms";
import { NextRequest } from "next/server";

function decode(token: string | null): number {
  return Number(token);
}

export async function displayBookWithToken(
  token: string | null,
  bookId: number,
  layerNumber: number | undefined
) {
  const userId = decode(token);
  return await displayBookAtLayer({ userId, bookId, layerNumber });
}

export async function GET(request: NextRequest) {
  let books;
  try {
    const token = request.headers.get("Authorization");
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get("bookId");
    if (!bookId) {
      throw new Error("bookId is required");
    }
    const layerNumber = searchParams.get("layerNumber");
    books = await displayBookWithToken(
      token,
      Number(bookId),
      layerNumber ? Number(layerNumber) : undefined
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(error.message, {
      status: 500,
    });
  }
  return Response.json({ data: { books } });
}

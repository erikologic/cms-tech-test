import { listBooks } from "@/cms/cms";

function decode(token: string | null): number {
  return Number(token);
}

export async function listBooksFromToken(token: string | null) {
  const userId = decode(token);
  return await listBooks({ userId });
}

export async function GET(request: Request) {
  let books;
  try {
    const token = request.headers.get("Authorization");
    books = await listBooksFromToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(error.message, {
      status: 500,
    });
  }
  return Response.json({ data: { books } });
}

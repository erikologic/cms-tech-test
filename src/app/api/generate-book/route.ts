import { generateBook } from "@/cms/cms";

function decode(token: string | null): number {
  return Number(token);
}

export async function POST(request: Request) {
  let bookId: number;
  try {
    const token = request.headers.get("Authorization");
    const userId = decode(token);
    const { name } = await request.json();
    bookId = await generateBook({ name, userId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(error.message, {
      status: 500,
    });
  }
  return Response.json({ data: { bookId } });
}

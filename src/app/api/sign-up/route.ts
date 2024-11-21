import { createUser } from "@/cms/cms";

export async function POST(request: Request) {
  let id;
  try {
    const { name } = await request.json();
    id = await createUser(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(error.message, {
      status: 500,
    });
  }
  return Response.json(
    { id },
    {
      status: 200,
    }
  );
}

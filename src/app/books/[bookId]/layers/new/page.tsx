import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import AddLayerForm from "./form";

export default async function NewLayer({params}: {
  params: Promise<{ bookId: string }>
}) {

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
      redirect("/sign-in");
  }

  const bookId = Number((await params).bookId);

  return (
    <main>
        <h1>Add layer</h1>
        <AddLayerForm token={token} bookId={bookId} />
    </main>
  );
}

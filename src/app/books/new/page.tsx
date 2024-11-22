import { redirect } from "next/navigation";
import AddBookForm from "./form";
import { cookies } from 'next/headers'

export default async function NewBook() {

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect("/sign-in");
  }

  return (
    <main>
        <h1>Add book</h1>
        <AddBookForm token={token} />
    </main>
  );
}

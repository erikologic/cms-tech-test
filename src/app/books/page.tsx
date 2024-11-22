import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listBooksFromToken } from "../api/list-books/route";

const NoBooks = () => (
  <p>No books yet!</p>
);

interface BooksListProps {
  books: { id: number; name: string }[];
}

const BooksList = ({ books }: BooksListProps) => (
  <ul>
    {books.map((book) => (
      <li key={book.id}>
        <Link href={`/books/${book.id}`}>{book.name}</Link>
      </li>
    ))}
  </ul>
);

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect("/sign-in");
  }

  const books = await listBooksFromToken(token);
  const isEmptyList = books.length === 0;
  return (
    <main>
      {isEmptyList ? (
        <NoBooks />
      ) : 
        <BooksList books={books} />
      }
        <Link href="/books/new">Add book</Link>
    </main>
  );
}

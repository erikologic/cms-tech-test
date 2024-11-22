import Link from "next/link";

export default function Home() {
  return (
    <main>
        <p>No books yet!</p>
        <Link href="/books/new">Add book</Link>
    </main>
  );
}

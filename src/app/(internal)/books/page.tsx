import { cookies } from 'next/headers';
import Link from 'next/link';
import { listBooksFromToken } from '../../api/list-books/route';
import { PageTitle } from '../../component/page-title';
import { LinkButton } from '../../component/link-button';

const NoBooks = () => <p>No books yet!</p>;

interface BooksListProps {
	books: { id: number; name: string }[];
}

const BooksList = ({ books }: BooksListProps) => (
	<ul>
		{books.map(book => (
			<li
				key={book.id}
				className="mt-3 text-lg/6 font-semibold text-gray-900 hover:text-gray-600"
			>
				<Link href={`/books/${book.id}`}>{book.name}</Link>
			</li>
		))}
	</ul>
);

export default async function Home() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')!.value;

	const books = await listBooksFromToken(token);
	const isEmptyList = books.length === 0;
	return (
		<>
			<nav className="mt-4 flex gap-4">
				<LinkButton href={'/books/new'}>Add book</LinkButton>
				<LinkButton href={'/api/sign-out'}>Sign out</LinkButton>
			</nav>

			<PageTitle>Your Books</PageTitle>
			{isEmptyList ? <NoBooks /> : <BooksList books={books} />}
		</>
	);
}

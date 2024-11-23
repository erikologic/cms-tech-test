import { cookies } from 'next/headers';
import Link from 'next/link';
import { listBooksFromToken } from '../../api/list-books/route';
import { PageTitle } from '../../component/typography';
import { LinkButton, NavBar } from '../../component/nav';
import React from 'react';
import { StyledListItem } from '@/app/component/lists';

const NoBooks = () => <p>No books yet!</p>;

interface BooksListProps {
	books: { id: number; name: string }[];
}

const BooksList = ({ books }: BooksListProps) => (
	<ul>
		{books.map(book => (
			<StyledListItem key={book.id} className="mt-3">
				<Link href={`/books/${book.id}`}>{book.name}</Link>
			</StyledListItem>
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
			<NavBar>
				<LinkButton href={'/books/new'}>Add book</LinkButton>
				<LinkButton href={'/api/sign-out'}>Sign out</LinkButton>
			</NavBar>

			<PageTitle>Your Books</PageTitle>
			{isEmptyList ? <NoBooks /> : <BooksList books={books} />}
		</>
	);
}

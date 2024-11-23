import { cookies } from 'next/headers';
import { getBookWithToken } from '@/app/api/get-book/route';
import { listLayersFromToken } from '@/app/api/list-layers/route';
import Link from 'next/link';
import { PageTitle } from '@/app/component/typography';
import { LinkButton, NavBar } from '@/app/component/nav';
import { StyledListItem } from '@/app/component/lists';

export default async function BookPage({
	params,
}: {
	params: Promise<{ bookId: string }>;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')!.value;

	const bookId = Number((await params).bookId);

	const [book, layers] = await Promise.all([
		getBookWithToken(token, bookId),
		listLayersFromToken(token, bookId),
	]);

	return (
		<>
			<NavBar>
				<LinkButton href={`/books/`}>Back to Books</LinkButton>
				<LinkButton href={`/books/${bookId}/layers/latest`}>
					Show latest book version
				</LinkButton>
				<LinkButton href={`/books/${bookId}/layers/new`}>
					Add layer
				</LinkButton>
			</NavBar>

			<PageTitle>Book: {book.name}</PageTitle>
			<h2 className="my-6 text-pretty text-3xl font-semibold tracking-tight text-gray-700">
				Layers list:
			</h2>
			<ul>
				{layers.map(layer => (
					<StyledListItem key={layer.id} className="mt-3">
						<Link href={`/books/${bookId}/layers/${layer.id}`}>
							{layer.name}
						</Link>
					</StyledListItem>
				))}
			</ul>
		</>
	);
}

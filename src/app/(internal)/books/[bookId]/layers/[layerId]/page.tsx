import { cookies } from 'next/headers';
import { displayBookWithToken } from '@/app/api/display-book-at-layer/route';
import { LinkButton, NavBar } from '@/app/component/nav';
import { PageTitle } from '@/app/component/typography';
import React from 'react';

export default async function LayersPage({
	params,
}: {
	params: Promise<{ layerId: string; bookId: string }>;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')!.value;

	const { layerId: layerSlug, bookId } = await params;
	const layerId = layerSlug === 'latest' ? undefined : Number(layerSlug);

	const values = await displayBookWithToken(token, Number(bookId), layerId);

	return (
		<>
			<NavBar>
				<LinkButton href={`/books/${bookId}`}>
					Back to Layers
				</LinkButton>
			</NavBar>
			<PageTitle>Book content:</PageTitle>

			<ul>
				{values.map(value => (
					<li
						key={value}
						className="mt-1 text-lg/6 font-semibold text-gray-900 hover:text-gray-600"
					>
						{value}
					</li>
				))}
			</ul>
		</>
	);
}

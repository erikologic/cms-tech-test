import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AddLayerForm from './form';
import { PageTitle } from '@/app/component/page-title';

export default async function NewLayer({
	params,
}: {
	params: Promise<{ bookId: string }>;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	if (!token) {
		redirect('/sign-in');
	}

	const bookId = Number((await params).bookId);

	return (
		<main>
			<PageTitle>Add layer</PageTitle>
			<AddLayerForm token={token} bookId={bookId} />
		</main>
	);
}

import { redirect } from 'next/navigation';
import AddBookForm from './form';
import { cookies } from 'next/headers';
import { PageTitle } from '@/app/component/page-title';

export default async function NewBook() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	if (!token) {
		redirect('/sign-in');
	}

	return (
		<main>
			<PageTitle>Add book</PageTitle>
			<AddBookForm token={token} />
		</main>
	);
}

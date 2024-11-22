import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	if (token) {
		redirect('/books');
	}

	return (
		<main>
			<h1>Abecederies CMS</h1>
			<Link href="/sign-up">Sign up</Link>
			<Link href="/sign-in">Sign in</Link>
		</main>
	);
}

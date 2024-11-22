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
		<main className="flex flex-col items-center">
			<h1 className="text-balance py-6 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
				Abecederies CMS
			</h1>
			<p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
				Kids will lov&apos;it!
			</p>
			<div className="flex justify-evenly py-6">
				<Link
					href="/sign-up"
					className="mr-8 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					Sign up
				</Link>
				<Link
					className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					href="/sign-in"
				>
					Sign in
				</Link>
			</div>
		</main>
	);
}

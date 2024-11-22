import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { LinkButton } from './component/link-button';

export default async function Home() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	if (token) {
		redirect('/books');
	}

	return (
		<>
			<h1 className="text-balance py-6 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
				Abecederies CMS
			</h1>
			<p className="mt-8 text-pretty text-lg font-medium text-gray-700 sm:text-xl/8">
				Kids will lov&apos;it!
			</p>
			<div className="flex justify-evenly gap-8 py-6">
				<LinkButton href={'/sign-up'}>Sign up</LinkButton>
				<LinkButton href={'/sign-in'}>Sign in</LinkButton>
			</div>
		</>
	);
}

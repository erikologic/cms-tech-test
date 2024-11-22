'use client';

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
	name: string;
};

export default function SignInForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = data => {
		fetch('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(async response => {
				if (!response.ok) {
					const message = await response.text();
					throw new Error(message);
				}
				router.push('/books');
			})
			.catch(error => {
				setError('root', {
					message: error.message,
				});
			});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col items-center"
		>
			<div className="sm:col-span-3">
				<label
					htmlFor="name"
					className="block text-sm/6 font-medium text-gray-900"
				>
					Name
				</label>
				<div className="mt-2">
					<input
						{...register('name', { required: true })}
						id="name"
						className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
					/>
				</div>
				{errors.name && (
					<span className="text-red-700">This field is required</span>
				)}
			</div>

			<input
				type="submit"
				value="Submit"
				className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			></input>
			{errors.root && (
				<span>Couldn&apos;t sign-up user: {errors.root.message}</span>
			)}
		</form>
	);
}

'use client';

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { addLayerPayloadSchema } from '@/app/api/add-layer/route';

type Inputs = {
	name: string;
	values: { value: string }[];
};

interface AddLayerFormProps {
	token: string;
	bookId: number;
}

const Trash = () => (
	<div className="left-0 top-0 flex size-10 items-center justify-center rounded-lg">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="size-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
			/>
		</svg>
	</div>
);
export default function AddLayerForm({ token, bookId }: AddLayerFormProps) {
	const router = useRouter();
	const {
		control,
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Inputs>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'values',
		rules: {
			minLength: 1,
			maxLength: 26,
			required: true,
		},
	});

	const onSubmit: SubmitHandler<Inputs> = data => {
		console.log(data);
		const payload = addLayerPayloadSchema.parse({
			layerName: data.name,
			bookId,
			values: data.values.map(({ value }) => value),
		});
		fetch('/api/add-layer', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
			},
		})
			.then(async response => {
				if (!response.ok) {
					const message = await response.text();
					throw new Error(message);
				}
				const {
					data: { layerId },
				} = await response.json();
				router.push(`/books/${bookId}/layers/${layerId}`);
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
			<div className="w-full">
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

			{fields.map((field, index) => (
				<div key={field.id} className="pt-4 sm:col-span-3">
					<label
						htmlFor={`value-${index}`}
						className="block text-sm/6 font-medium text-gray-900"
					>
						Value
					</label>
					<div className="flex align-top">
						<div className="mt-2">
							<input
								{...register(`values.${index}.value`)}
								id={`value-${index}`}
								className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
							/>
						</div>
						<button
							type="button"
							onClick={() => remove(index)}
							className="mx-2 my-1 rounded-md text-sm font-semibold shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
						>
							<Trash />
						</button>
					</div>

					{errors.name && (
						<span className="text-red-700">
							This field is required
						</span>
					)}
				</div>
			))}
			<button
				type="button"
				onClick={() => {
					append({ value: '' });
				}}
				className="mt-4 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Add Value
			</button>

			<input
				type="submit"
				value="Save"
				className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			></input>
			{errors.root && (
				<span>Couldn&apos;t sign-up user: {errors.root.message}</span>
			)}
		</form>
	);
}

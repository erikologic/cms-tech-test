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
		})
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
				router.push(`/books/${bookId}/layers/${layerId}}`);
			})
			.catch(error => {
				setError('root', {
					message: error.message,
				});
			});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<label htmlFor="name">Name</label>
			<input {...register('name', { required: true })} id="name" />
			{errors.name && <span>This field is required</span>}

			{fields.map((field, index) => (
				<div key={field.id}>
					<label htmlFor={`value-${index}`}>Value</label>
					<input
						{...register(`values.${index}.value`)}
						id={`value-${index}`}
					/>
					<button type="button" onClick={() => remove(index)}>
						Delete
					</button>
				</div>
			))}
			<button
				type="button"
				onClick={() => {
					append({ value: '' });
				}}
			>
				Add Value
			</button>

			<input type="submit" value="Save"></input>
			{errors.root && (
				<span>Couldn&apos;t create layer: {errors.root.message}</span>
			)}
		</form>
	);
}

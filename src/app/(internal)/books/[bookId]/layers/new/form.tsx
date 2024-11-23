'use client';

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { addLayerPayloadSchema } from '@/app/api/add-layer/route';
import { Trash } from '@/app/component/icons';
import {
	ErrorMsg,
	InputLabel,
	InputSubmit,
	InputText,
	StyledForm,
} from '@/app/component/form';

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
		<StyledForm onSubmit={handleSubmit(onSubmit)}>
			<div className="w-full">
				<InputLabel htmlFor="name">Name</InputLabel>
				<InputText
					id="name"
					{...register('name', { required: true })}
				/>
				{errors.name && <ErrorMsg message={errors.name.message} />}
			</div>

			{fields.map((field, index) => (
				<div key={field.id} className="pt-4">
					<InputLabel htmlFor={`value-${index}`}>Value</InputLabel>

					<div className="flex align-top">
						<InputText
							id={`value-${index}`}
							{...register(`values.${index}.value`)}
						/>
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

			<InputSubmit value="Save" />
			{errors.root && <ErrorMsg message={errors.root.message} />}
		</StyledForm>
	);
}

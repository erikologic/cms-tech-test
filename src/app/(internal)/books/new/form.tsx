'use client';

import {
	InputLabel,
	InputText,
	ErrorMsg,
	InputSubmit,
	StyledForm,
} from '@/app/component/form';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
	name: string;
};

interface AddBookFormProps {
	token: string;
}

export default function AddBookForm({ token }: AddBookFormProps) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = data => {
		fetch('/api/generate-book', {
			method: 'POST',
			body: JSON.stringify(data),
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
				router.push('/books');
			})
			.catch(error => {
				setError('root', {
					message: error.message,
				});
			});
	};

	return (
		<StyledForm onSubmit={handleSubmit(onSubmit)}>
			<div>
				<InputLabel htmlFor="name">Name</InputLabel>
				<InputText
					id="name"
					{...register('name', { required: true })}
				/>
				{errors.name && <ErrorMsg message={errors.name.message} />}
			</div>

			<InputSubmit value="Create" />
			{errors.root && <ErrorMsg message={errors.root.message} />}
		</StyledForm>
	);
}

'use client';

import { raiseWhenNotOk } from '@/app/component/fetch';
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
			.then(raiseWhenNotOk)
			.then(() => {
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

			<InputSubmit value="Sign in" />
			{errors.root && <ErrorMsg message={errors.root.message} />}
		</StyledForm>
	);
}

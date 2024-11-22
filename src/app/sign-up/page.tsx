import SignUpForm from './form';

export default function SignUp() {
	return (
		<main className="flex flex-col items-center">
			<h1 className="my-8 text-pretty text-4xl font-semibold tracking-tight text-gray-900">
				Sign up
			</h1>
			<SignUpForm />
		</main>
	);
}

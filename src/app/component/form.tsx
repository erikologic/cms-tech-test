import { DetailedHTMLProps, FormHTMLAttributes } from 'react';

export const InputLabel = ({
	htmlFor,
	children,
}: {
	htmlFor: string;
	children: string;
}) => (
	<label
		htmlFor={htmlFor}
		className="block text-sm/6 font-medium text-gray-900"
	>
		{children}
	</label>
);
export function InputText<T>({ id, ...props }: T & { id: string }) {
	return (
		<input
			{...props}
			id={id}
			className="mt-2 block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
		/>
	);
}
export const ErrorMsg = ({ message }: { message: string | undefined }) => (
	<span className="text-red-700">{message || 'An error occurred'}</span>
);
export const InputSubmit = ({ value }: { value: string }) => (
	<input
		type="submit"
		value={value}
		className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	/>
);

type FormProps = DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;
export const StyledForm = ({ children, ...props }: FormProps) => (
	<form {...props} className="flex flex-col items-center">
		{children}
	</form>
);

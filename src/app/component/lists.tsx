import { twMerge } from "tailwind-merge";

export const StyledListItem = ({children, className}: React.PropsWithChildren & {className: string}) => (
	<li
		className={twMerge(className, 'text-lg/6 font-semibold text-gray-900 hover:text-gray-600')}
	>
		{children}
	</li>
)

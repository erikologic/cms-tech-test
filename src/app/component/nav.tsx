import Link from 'next/link';

interface LinkButtonProps {
	href: string;
	children: React.ReactNode;
}

export const LinkButton = ({ href, children }: LinkButtonProps) => (
	<Link
		className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		href={href}
	>
		{children}
	</Link>
);

export const NavBar = ({ children }: React.PropsWithChildren) => (
	<nav className="mt-4 flex gap-4">{children}</nav>
);

import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import { getBookWithToken } from "@/app/api/get-book/route";
import { listLayersFromToken } from "@/app/api/list-layers/route";
import Link from "next/link";

export default async function BookPage({params}: {
    params: Promise<{ bookId: string }>
}) {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect("/sign-in");
    }
  
    const bookId = Number((await params).bookId);

    const [book, layers] = await Promise.all([ 
        getBookWithToken(token, bookId),
        listLayersFromToken(token, bookId)
    ]);
    
    return (
        <div>
            <h1>Book Name: {book.name}</h1>
            <h2>Layers</h2>
            <ul>
                {layers.map((layer) => (
                    <li key={layer.id}>
                        {layer.name}
                    </li>
                ))}
            </ul>
            <Link href={`/books/${bookId}/layers/latest`}>Show latest book version</Link>
            <Link href={`/books/${bookId}/layers/new`}>Add layer</Link>
        </div>
    );
};


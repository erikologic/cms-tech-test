import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import { displayBookWithToken } from "@/app/api/display-book-at-layer/route";
import Link from "next/link";

export default async function LayersPage({params}: {
    params: Promise<{ layerId: string, bookId: string }>
}) {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect("/sign-in");
    }
    const { layerId: layerSlug, bookId } = await params;
    const layerId = layerSlug === "latest" 
        ? undefined
        : Number(layerSlug);

    const values = await displayBookWithToken(token, Number(bookId), layerId);

    return (
        <div>
            <Link href={`/books/${bookId}`}>Back to Layers</Link>
            <h1>Values:</h1>
            <ul>
                {values.map((value) => (
                    <li key={value}>{value}</li>
                ))}                
            </ul>
        </div>
    );
};
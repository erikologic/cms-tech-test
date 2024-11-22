export default async function BookPage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return (
        <div>
            <h1>Book ID: {id}</h1>
        </div>
    );
};


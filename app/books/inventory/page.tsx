import BooksClientStock from './BooksClientStock';

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const params = await searchParams;

    return <BooksClientStock />;
}

'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    imageURL?: string | null;
    inventory?: { quantity: number } | null;
    categories?: Array<{ category: { name: string } }>;
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default function BooksClientStock() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState(false);
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const hasFetched = useRef(false);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();

        if (!trimmed) return;

        router.push(`/books/inventory?search=${encodeURIComponent(trimmed)}`);
    };

    const fetchBooks = async () => {
        setLoading(true);

        try {
            let url = `/api/books/list?limit=20`;

            if (categorySlug) url += `&category=${encodeURIComponent(categorySlug)}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

            const res = await fetch(url);
            const data = await res.json();

            setBooks(data.items || []);
        } catch (err) {
            console.error('Error fetching books:', err);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (bookId: number) => {
        setAddingToCart(bookId);

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId,
                    quantity: 1,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert(`Added to cart!`);
            } else {
                alert(data.error || 'Failed to add to cart');
            }
        } catch (err) {
            console.error('Add to cart error:', err);
            alert('Error adding book to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [categorySlug, searchQuery]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories?limit=30');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#2f3e46]">
                    {categorySlug
                        ? `Books in ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`
                        : 'All Books'}
                </h1>
                <p className="mt-2 text-[#52796f]">
                    {categorySlug
                        ? `Exploring the ${categorySlug} category`
                        : 'Search and filter our book collection'}
                </p>

                <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none focus:border-[#52796f]"
                    />
                    <button
                        type="submit"
                        className="rounded-xl bg-[#2f3e46] px-6 py-3 font-semibold text-white hover:opacity-90 whitespace-nowrap"
                    >
                        Search
                    </button>
                </form>

                {!loadingCategories && categories.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        <button
                            onClick={() => router.push('/books/inventory')}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                !categorySlug
                                    ? 'bg-[#2f3e46] text-white'
                                    : 'bg-white border border-[#cad2c5] hover:bg-gray-100'
                            }`}
                        >
                            All Books
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => router.push(`/books/inventory?category=${cat.slug}`)}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                    categorySlug === cat.slug
                                        ? 'bg-[#2f3e46] text-white'
                                        : 'bg-white border border-[#cad2c5] hover:bg-gray-100'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading && <p className="text-center py-12 text-[#52796f]">Loading books...</p>}

            {!loading && books.length === 0 && (
                <p className="text-center py-12 text-[#52796f]">No books found.</p>
            )}

            {!loading && books.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="overflow-hidden rounded-3xl border border-[#cad2c5] bg-white shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex h-56 items-center justify-center bg-[#edf1eb] overflow-hidden">
                                {book.imageURL ? (
                                    <Image
                                        src={book.imageURL}
                                        alt={book.title}
                                        width={220}
                                        height={220}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-[#52796f]">No image</span>
                                )}
                            </div>

                            <div className="p-5">
                                <p className="text-sm font-medium text-[#52796f]">
                                    {book.categories?.[0]?.category?.name || 'General'}
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-[#2f3e46] line-clamp-2">
                                    {book.title}
                                </h3>

                                <p className="mt-1 text-sm text-[#52796f]">{book.author}</p>

                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-[#354f52]">
                                        Stock: {book.inventory?.quantity ?? 0}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 font-medium ${
                                            (book.inventory?.quantity ?? 0) > 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {(book.inventory?.quantity ?? 0) > 0
                                            ? 'Available'
                                            : 'Out of stock'}
                                    </span>
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <span className="font-bold text-[#354f52]">
                                        ${book.price.toFixed(2)}
                                    </span>

                                    <button
                                        onClick={() => addToCart(book.id)}
                                        disabled={addingToCart === book.id}
                                        className="rounded-xl bg-[#2f3e46] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                                    >
                                        {addingToCart === book.id ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

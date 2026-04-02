'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BookImage from '@/components/BookImage';

type CartItem = {
    id: number;
    quantity: number;
    book: {
        id: number;
        title: string;
        author: string;
        price: number;
        imageURL?: string;
    };
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to load cart');

            setCartItems(data.items);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to load cart');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (bookId: number, quantity: number) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ bookId, quantity }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            await fetchCart(); // refresh from DB
        }  catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to update cart');
            }
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
    );

    if (loading) return <p className="p-6">Loading cart...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Items */}
                    <div className="md:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="border p-4 rounded-xl">
                                <div className="flex gap-4">
                                    <BookImage
                                        src={item.book.imageURL}
                                        alt={item.book.title}
                                        className="object-cover rounded"
                                    />

                                    <div className="flex-1">
                                        <h2 className="font-semibold">
                                            {item.book.title}
                                        </h2>
                                        <p>{item.book.author}</p>
                                        <p>{formatPrice(item.book.price)}</p>

                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.book.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.book.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.book.id, 0)
                                                }
                                                className="text-red-500 ml-4"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="border p-6 rounded-xl">
                        <h2 className="text-xl font-semibold">Summary</h2>
                        <p className="mt-4">
                            Total: <strong>{formatPrice(total)}</strong>
                        </p>

                        <Link
                            href="/checkout"
                            className="block mt-4 bg-black text-white text-center py-2 rounded"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}
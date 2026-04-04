'use client';

import { useEffect, useState } from 'react';
import BookImage from '@/components/BookImage';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface Book {
    id: number;
    title: string;
    price: number;
    imageURL?: string;
}
interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    book: Book;
}
interface Order {
    id: number;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    items: OrderItem[];
}

export default function CheckoutSuccessPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                setError('No session ID found.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/checkout/success?session_id=${sessionId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to fetch order');

                setOrder(data.order);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError('Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    if (loading) return <p className="p-6">Loading order...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!order) return <p className="p-6">Order not found.</p>;

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Thank you for your order!</h1>
            <p>
                Your order has been confirmed. Order ID: <strong>{order.id}</strong>
            </p>
            <p>
                Status: {order.paymentStatus === PaymentStatus.PAID ? 'Paid ✅' : 'Processing ⏳'}
            </p>

            <div className="space-y-4">
                {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 border p-4 rounded-xl">
                        {item.book.imageURL && (
                            <BookImage
                                src={item.book.imageURL}
                                alt={item.book.title}
                                className="w-24 h-32 object-cover rounded"
                            />
                        )}
                        <div className="flex-1">
                            <h2 className="font-semibold">{item.book.title}</h2>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border p-4 rounded-xl text-right font-bold text-lg">
                Total Paid: ${order.total.toFixed(2)}
            </div>
        </main>
    );
}

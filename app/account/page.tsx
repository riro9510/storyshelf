import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import OrdersSection from './OrdersSection';

export default async function AccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-20">
                <p>Not logged in.</p>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            {/* HEADER */}
            <div className="mb-10">
                <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                    My Account
                </span>
                <h1 className="mt-4 text-3xl font-bold">Welcome back, {user.firstName}</h1>
                <p className="text-[#52796f]">View your profile and order history</p>
            </div>

            {/* PROFILE */}
            <div className="mb-10 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>

                <div className="space-y-2 text-[#52796f]">
                    <p>
                        <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div>

            {/* ORDERS (client component below) */}
            <OrdersSection />
        </main>
    );
}

import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const books = await prisma.book.findMany();
    return (
        <div>
        <h1>Dashboard</h1>
        <p>Books in DB: {books.length}</p>
        </div>
    );
}
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'customer',
    employeeCode: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unable to create account.');
        return;
      }

      setSuccess('Account created successfully.');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch {
      setError('Unexpected error while creating account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-[#52796f]">
          StoryShelf Access
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Register as a customer or employee.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">First Name</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
            placeholder="Your first name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
            placeholder="Your last name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Account Type</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                role: e.target.value,
                employeeCode: e.target.value === 'employee' ? prev.employeeCode : '',
              }))
            }
            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
          >
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {form.role === 'employee' && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Employee Registration Code
            </label>
            <input
              type="text"
              value={form.employeeCode}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, employeeCode: e.target.value }))
              }
              className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
              placeholder="Enter employee code"
              required
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#354f52] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-[#52796f] underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
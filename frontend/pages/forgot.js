import { useState } from "react";
import Link from "next/link";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${DJANGO_API_URL}/auth/recover/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "If an account with that email exists, we've sent recovery instructions." });
      } else {
        setStatus({ type: "success", message: "If an account with that email exists, we've sent recovery instructions." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Unable to contact server. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-16">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white px-8 py-12 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Recover account</h1>
            <p className="mt-2 text-sm text-slate-600">Enter the email address associated with your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {status && (
              <div className={`rounded-lg px-4 py-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                {status.message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send recovery email'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Remembered your credentials?{' '}
            <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700">Sign in</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

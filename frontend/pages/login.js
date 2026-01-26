import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/listings");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-16">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white px-8 py-12 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to save your favorite listings
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Use your username (not email) to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="Enter your username"
              />
              <p className="mt-1 text-xs text-slate-500">
                Use the username you created during registration
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="••••••••"
              />
              <div className="mt-2 text-right">
                <Link href="/forgot" className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a4 4 0 014-4h4" />
                  </svg>
                  Forgot username or password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-amber-600 hover:text-amber-700">
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


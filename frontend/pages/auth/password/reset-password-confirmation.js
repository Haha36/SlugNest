import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ResetPasswordConfirmation() {
  const router = useRouter();
  const { uid, token } = router.query;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";

  useEffect(() => {
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!uid || !token) {
      setStatus({ type: "error", message: "Missing reset link parameters." });
      return;
    }

    if (!password || password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    if (password !== confirm) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${DJANGO_API_URL}/auth/users/reset_password_confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: password }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Your password has been reset. You can now sign in." });
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.detail || (err.errors && JSON.stringify(err.errors)) || "Unable to reset password. Try a different password.";
        setStatus({ type: "error", message: msg });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-16">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white px-8 py-12 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Reset your password</h1>
            <p className="mt-2 text-sm text-slate-600">Choose a new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {status && (
              <div className={`rounded-lg px-4 py-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                {status.message}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">New password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="Create a password (min 8 chars)"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-700">Confirm password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="Repeat your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {isLoading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700">Back to sign in</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

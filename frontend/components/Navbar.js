import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { href: "/listings", label: "Listings" },
  { href: "/saved", label: "Saved" },
  { href: "/my-listings", label: "Add House" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();

  const loggedIn = isAuthenticated || !!session;

  const handleLogout = async () => {
    await logout();
    if (session) await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-amber-600">
            SN
          </span>{" "}
          SlugNest
        </Link>

        <div className="flex items-center gap-1 rounded-full bg-orange-50/90 p-1 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50"
          >
            Log Out
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50"
          >
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
}

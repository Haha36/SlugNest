import { useEffect, useState } from "react";
import ListingCard from "../components/Listing-card";
import Link from "next/link";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const response = await fetch("/api/houses");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // For feature page, sort by id in descending order and show only the 6 newest listings
        const sorted = data.sort((a, b) => b.oid - a.oid).slice(0, 6);
        setFeatured(sorted);
      } catch (error) {
        console.error(error);
        setHasError(true);
      }
    }

    loadFeatured();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="warm-sheen rounded-3xl bg-white px-8 py-14 text-slate-900 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            SlugNest
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Connecting students with budget-friendly homes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Options include houses, apartments, long-term stay at hotels, and more.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-amber-300"
            >
              View Listings
            </Link>
            <Link
              href="/add-house"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-amber-50"
            >
              Add a Home
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                Featured
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Latest Listings
              </h2>
            </div>
            <Link
              href="/listings"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Explore all →
            </Link>
          </div>

          {hasError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              Unable to load featured listings right now.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((house) => (
                <ListingCard key={house.oid} house={house} />
              ))}
              {featured.length === 0 && (
                <div className="rounded-2xl border border-dashed border-amber-200 bg-white/80 px-6 py-10 text-center text-slate-500">
                  Listings will appear here once available.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

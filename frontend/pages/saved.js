import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ListingCard from "../components/Listing-card";
import { useAuth } from "../contexts/AuthContext";
import { useSession } from "next-auth/react";

export default function SavedPage() {
  const [savedListings, setSavedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, getAuthHeaders, loading: authLoading } = useAuth();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const getHeaders = () => {
    if (isAuthenticated) return getAuthHeaders();
    if (session?.djangoAccessToken) return { Authorization: `Bearer ${session.djangoAccessToken}` };
    return {};
  };

  useEffect(() => {
    if (authLoading || sessionStatus === "loading") return;

    const isAuthed = isAuthenticated || !!session?.djangoAccessToken;
    console.log("[saved] isAuthenticated:", isAuthenticated, "djangoAccessToken:", session?.djangoAccessToken, "isAuthed:", isAuthed);
    if (!isAuthed) {
      router.push("/login");
      return;
    }

    async function fetchSavedListings() {
      try {
        const headers = getHeaders();
        const response = await fetch("/api/saved", {
          headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Unable to load saved listings.");
        }

        const data = await response.json();
        setSavedListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedListings();
  }, [isAuthenticated, authLoading, sessionStatus, session]);

  const handleUnsave = async (houseId) => {
    try {
      const headers = getHeaders();
      const response = await fetch("/api/saved", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ house_id: houseId }),
      });

      if (response.ok) {
        // Remove from local state
        setSavedListings((prev) =>
          prev.filter((item) => item.house.oid !== houseId)
        );
      } else {
        throw new Error("Failed to unsave listing");
      }
    } catch (err) {
      console.error("Error unsaving listing:", err);
      alert("Failed to unsave listing. Please try again.");
    }
  };

  if (authLoading || sessionStatus === "loading" || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 px-4 py-16">
        <section className="mx-auto max-w-6xl">
          <p className="rounded-2xl bg-white/90 px-4 py-3 text-center text-slate-500 shadow-sm">
            Loading saved listings...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 px-4 py-16">
        <section className="mx-auto max-w-6xl">
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-center text-rose-600 shadow-sm">
            {error}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 px-4 py-16">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">
            Saved Listings
          </h1>
          <p className="text-base text-slate-600">
            {savedListings.length === 0
              ? "You haven't saved any listings yet."
              : "If a listing is no longer available, it will be deleted automatically."}
          </p>
        </header>

        {savedListings.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-white px-8 py-16 text-center shadow-xl">
            <p className="text-base text-slate-600">
              Start saving listings you're interested in!
            </p>
            <Link
              href="/listings"
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-600"
            >
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedListings.map((item) => (
              <ListingCard
                key={item.house.oid}
                house={item.house}
                isSaved={true}
                onToggleSave={() => handleUnsave(item.house.oid)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

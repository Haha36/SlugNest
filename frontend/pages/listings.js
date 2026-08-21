import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ListingCard from "../components/Listing-card";
import { useAuth } from "../contexts/AuthContext";

export default function ListingsPage() {
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [filter, setFilter] = useState("all");
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();

  const isAuthed = isAuthenticated || !!session?.djangoAccessToken;

  const getHeaders = () => {
    if (isAuthenticated) return getAuthHeaders();
    if (session?.djangoAccessToken) {
      return {
        Authorization: `Bearer ${session.djangoAccessToken}`,
        "Content-Type": "application/json",
      };
    }
    return {};
  };

  const fetchSavedListings = async () => {
    if (!isAuthed) return;

    try {
      const headers = getHeaders();
      const response = await fetch("/api/saved", {
        headers,
      });

      if (response.ok) {
        const savedListings = await response.json();
        const ids = new Set(savedListings.map((item) => item.house.oid));
        setSavedIds(ids);
      }
    } catch (err) {
      console.error("Error fetching saved listings:", err);
    }
  };

  const toggleSaved = async (id) => {
    if (!isAuthed) {
      router.push("/login");
      return;
    }

    const isCurrentlySaved = savedIds.has(id);
    const newSavedIds = new Set(savedIds);

    try {
      const headers = getHeaders();

      if (isCurrentlySaved) {
        // Unsave
        const response = await fetch("/api/saved", {
          method: "DELETE",
          headers,
          body: JSON.stringify({ house_id: id }),
        });

        if (response.ok) {
          newSavedIds.delete(id);
          setSavedIds(newSavedIds);
        } else {
          throw new Error("Failed to unsave listing");
        }
      } else {
        // Save
        const response = await fetch("/api/saved", {
          method: "POST",
          headers,
          body: JSON.stringify({ house_id: id }),
        });

        if (response.ok) {
          newSavedIds.add(id);
          setSavedIds(newSavedIds);
        } else {
          throw new Error("Failed to save listing");
        }
      }
    } catch (err) {
      console.error("Error toggling saved status:", err);
      alert("Failed to update saved status. Please try again.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    async function fetchHouses() {
      try {
        const url = filter === "all" ? "/api/listings/" : `/api/listings/?listing_type=${filter}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Unable to load listings. Please try again later.");
        }
        const data = await response.json();
        if (isMounted) {
          setHouses(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHouses();
    fetchSavedListings();

    return () => {
      isMounted = false;
    };
  }, [isAuthed, filter]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-12">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Explore
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Available Listings
          </h1>
          <p className="text-base text-slate-600">
            You can see available listings and save them for later.
          </p>
        </header>

        {isLoading && (
          <p className="rounded-2xl bg-white/90 px-4 py-3 text-center text-slate-500 shadow-sm">
            Loading listings...
          </p>
        )}

        {error && !isLoading && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-center text-rose-600 shadow-sm">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="mb-6 flex justify-center gap-2">
            {["all", "sublet", "long_term"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === type
                    ? "bg-amber-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-amber-50"
                }`}
              >
                {type === "all" ? "All" : type === "sublet" ? "Sublet / Short Term" : "Long Term"}
              </button>
            ))}
          </div>
        )}

        {!isLoading && !error && houses.length === 0 && (
          <p className="rounded-2xl bg-white px-4 py-3 text-center text-slate-500 shadow-sm">
            No listings found. Try adding a new home.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {houses.map((house) => (
              <ListingCard
                key={house.oid}
                house={house}
                isSaved={savedIds.has(house.oid)}
                onToggleSave={() => toggleSaved(house.oid)}
              />
            ))}
        </div>
      </section>
    </main>
  );
}

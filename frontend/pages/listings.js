import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ListingCard from "../components/Listing-card";
import { useAuth } from "../contexts/AuthContext";

export default function ListingsPage() {
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const router = useRouter();

  const fetchSavedListings = async () => {
    if (!isAuthenticated) return;

    try {
      const headers = getAuthHeaders();
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
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const isCurrentlySaved = savedIds.has(id);
    const newSavedIds = new Set(savedIds);

    try {
      const headers = getAuthHeaders();
      
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

    async function fetchHouses() {
      try {
        const response = await fetch("/api/listings/");
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
  }, [isAuthenticated]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white px-4 py-12">
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

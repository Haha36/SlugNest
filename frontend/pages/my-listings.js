import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddHouseForm from "../components/AddHouseForm";
import EditListingModal from "../components/EditListingModal";

function getDjangoUserId(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).user_id;
  } catch {
    return null;
  }
}

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [contactHouse, setContactHouse] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/OAuthlogin");
  }, [status]);

  const fetchMyListings = async () => {
    if (!session?.djangoAccessToken) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/my-listings", {
        headers: { Authorization: `Bearer ${session.djangoAccessToken}` },
      });
      if (res.ok) setHouses(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.djangoAccessToken) fetchMyListings();
  }, [session]);

  if (status === "loading" || !session) return null;

  const token = session.djangoAccessToken;

  const handleDelete = async (oid) => {
    try {
      const res = await fetch(`/api/houses/${oid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setHouses((prev) => prev.filter((h) => h.oid !== oid));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (updated) => {
    setHouses((prev) => prev.map((h) => (h.oid === updated.oid ? updated : h)));
    setEditingHouse(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white px-4 py-12">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">My Listings</h1>
          <p className="text-base text-slate-600">Your posted listings. Click + to add a new one.</p>
        </header>

        {isLoading ? (
          <p className="rounded-2xl bg-white/90 px-4 py-3 text-center text-slate-500 shadow-sm">
            Loading your listings...
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Add New House card */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-8 text-amber-600 transition hover:border-amber-500 hover:bg-amber-50 hover:shadow-md min-h-[220px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span className="text-base font-semibold">Add New House</span>
            </button>

            {/* Owned listing cards */}
            {houses.map((house) => (
              <article
                key={house.oid}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Edit / Delete buttons — top-right corner */}
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  {deletingId === house.oid ? (
                    <>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(house.oid)}
                        className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-600"
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingHouse(house)}
                        className="rounded-full border border-amber-200 bg-white/90 px-2 py-1 text-xs font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(house.oid)}
                        className="rounded-full border border-red-200 bg-white/90 px-2 py-1 text-xs font-semibold text-red-500 shadow-sm transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                <div className="border-b border-slate-100 bg-gradient-to-r from-amber-200/50 via-orange-200/40 to-rose-200/40 px-6 py-4 pr-28">
                  <p className="text-sm uppercase tracking-wide text-amber-700">
                    #{String(house.oid).padStart(3, "0")}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    ${Number(house.rent).toLocaleString()}
                    <span className="text-base font-medium text-slate-600"> /mo</span>
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-6 py-5">
                  <p className="text-lg font-semibold text-slate-900">{house.address}</p>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{house.beds} beds</span>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{house.baths} baths</span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{house.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                  {house.contact && (
                    <button
                      onClick={() => setContactHouse(house)}
                      className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-600"
                    >
                      Contact
                    </button>
                  )}
                  {house.More_information && (
                    <a
                      href={house.More_information}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-amber-600"
                    >
                      Learn more
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Add House Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-2 shadow-lg">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <AddHouseForm
              token={token}
              onSuccess={(newHouse) => {
                setHouses((prev) => [newHouse, ...prev]);
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setContactHouse(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Contact Information</h3>
            <p className="mb-4 break-words text-slate-700">{contactHouse.contact}</p>
            <button
              onClick={() => setContactHouse(null)}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingHouse && (
        <EditListingModal
          house={editingHouse}
          token={token}
          onClose={() => setEditingHouse(null)}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}

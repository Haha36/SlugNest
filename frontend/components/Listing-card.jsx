import { useState } from "react";

const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;
  return numberValue.toLocaleString();
};

export default function ListingCard({ house, isSaved = false, onToggleSave }) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <article className="relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {onToggleSave ? (
        <button
          type="button"
          aria-pressed={isSaved}
          aria-label={isSaved ? "Unsave listing" : "Save listing"}
          onClick={onToggleSave}
          className={`absolute right-4 top-4 rounded-full border bg-white/90 p-2 transition ${
            isSaved
              ? "border-rose-300 text-rose-500 shadow-sm"
              : "border-slate-200 text-slate-500 hover:text-rose-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isSaved ? "0" : "2"}
            className="h-5 w-5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      ) : null}
      <div className="border-b border-slate-100 bg-gradient-to-r from-amber-200/50 via-orange-200/40 to-rose-200/40 px-6 py-4 pr-16">
        <p className="text-sm uppercase tracking-wide text-amber-700">
          #{String(house.oid ?? "0").padStart(3, "0")}
        </p>
        <p className="text-2xl font-semibold text-slate-900">
          ${formatCurrency(house.rent)}
          <span className="text-base font-medium text-slate-600"> /mo</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-5">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {house.address || "Address unavailable"}
          </p>
          <p className="text-sm text-slate-500">
            {house.square_feet ? `${house.square_feet} sq ft` : "Size TBD"}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
            {house.beds} beds
          </span>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
            {house.baths} baths
          </span>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          {house.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-600">
        {house.contact && (
          <button
            onClick={() => setShowContactModal(true)}
            className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-600"
          >
            Contact
          </button>
        )}
        {house.More_information ? (
          <a
            href={house.More_information}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-amber-600"
          >
            Learn more
          </a>
        ) : null}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Contact Information
            </h3>
            <p className="mb-4 break-words text-slate-700">{house.contact}</p>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

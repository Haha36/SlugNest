import { useState } from "react";

export default function EditListingModal({ house, token, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    rent: house.rent ?? "",
    beds: house.beds ?? "",
    baths: house.baths ?? "",
    square_feet: house.square_feet ?? "",
    address: house.address ?? "",
    description: house.description ?? "",
    contact: house.contact ?? "",
    More_information: house.More_information ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/houses/${house.oid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          square_feet: formData.square_feet === "" ? null : formData.square_feet,
        }),
      });

      if (!response.ok) {
        setError("Failed to save changes. Please try again.");
        return;
      }

      const updated = await response.json();
      onSaved(updated);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-5">Edit Listing</h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
            <input type="number" name="rent" value={formData.rent} onChange={handleChange} required min="0" step="0.01" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input type="number" name="beds" value={formData.beds} onChange={handleChange} required min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input type="number" name="baths" value={formData.baths} onChange={handleChange} required min="0" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sq. Ft</label>
            <input type="number" name="square_feet" value={formData.square_feet} onChange={handleChange} min="0" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">More Information (Optional URL)</label>
            <input type="url" name="More_information" value={formData.More_information} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 py-2 rounded-md font-medium text-white transition-colors ${
                isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function AddHouseForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    rent: "",
    beds: "",
    baths: "",
    square_feet: "",
    address: "",
    distanceByCar: "",
    distanceByBus: "",
    description: "",
    contact: "",
    More_information: "", 
  });

  // State for handling form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Submit to Next.js API route (which then forwards to Django)
      const distanceSentence = `Distance to UCSC: ${formData.distanceByCar} minutes by car or ${formData.distanceByBus} minutes by bus.`;
      const payload = {
        ...formData,
        listing_type: 'sublet',
        square_feet: formData.square_feet === "" ? null : formData.square_feet,
        description: formData.description
          ? `${formData.description} ${distanceSentence}`
          : distanceSentence,
      };
      delete payload.distanceByCar;
      delete payload.distanceByBus;

      const response = await fetch("/api/houses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newHouse = await response.json();
        if (onSuccess) {
          onSuccess(newHouse);
        } else {
          setSubmitMessage("House added successfully!");
          setFormData({
            rent: "",
            beds: "",
            baths: "",
            square_feet: "",
            address: "",
            distanceByCar: "",
            distanceByBus: "",
            description: "",
            contact: "",
            More_information: "",
          });
        }
      } else {
        setSubmitMessage("Error adding house. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitMessage("Error adding house. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Add New Short Term/Sublet Listing
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Listings are automatically removed after 60 days. Contact us if you need your listing to stay longer.
      </p>

      {submitMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            submitMessage.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Monthly Rent */}
        <div>
          <label
            htmlFor="rent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Monthly Rent
          </label>
          <input
            type="number"
            id="rent"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            placeholder="eg. 1800"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="beds"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Bedrooms
            </label>
            <input
              type="number"
              id="beds"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              placeholder="eg. 3"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="baths"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Bathrooms
            </label>
            <input
              type="number"
              id="baths"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              placeholder="eg. 2"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Square Feet */}
        <div>
          <label
            htmlFor="square_feet"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sq. Ft (Optional)
          </label>
          <input
            type="number"
            id="square_feet"
            name="square_feet"
            value={formData.square_feet}
            onChange={handleChange}
            placeholder="eg. 1200"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="eg. 123 Main St, City, State 12345"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Distance to UCSC */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Distance to UCSC
            </label>
            <a
              href="https://www.google.com/maps/dir//University+of+California+Santa+Cruz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Check on Google Maps
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="distanceByCar"
                name="distanceByCar"
                value={formData.distanceByCar}
                onChange={handleChange}
                placeholder="eg. 10"
                min="0"
                required
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">min by car</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="distanceByBus"
                name="distanceByBus"
                value={formData.distanceByBus}
                onChange={handleChange}
                placeholder="eg. 20"
                min="0"
                required
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">min by bus</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the property features, included utilities, amenities, etc."
            rows="4"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Contact Information */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Information
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="eg. Number, Email, or Social Media etc."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* More Information URL */}
        <div>
          <label
            htmlFor="More_information"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            More Information (Optional URL)
          </label>
          <input
            type="url"
            id="More_information"
            name="More_information"
            value={formData.More_information}
            onChange={handleChange}
            placeholder="eg. https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? "Adding House..." : "Add House Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}

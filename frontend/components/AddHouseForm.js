import { useState } from "react";

export default function AddHouseForm() {
  // State to manage form data - mirrors your Django House model
  const [formData, setFormData] = useState({
    rent: "",
    beds: "",
    baths: "",
    square_feet: "",
    address: "",
    description: "",
    contact: "",
    More_infomation: "", // Note: keeping the same field name as your Django model
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
      const response = await fetch("/api/houses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Alternative: Submit directly to Django backend
      // const response = await fetch('http://localhost:8000/api/houses/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add authentication headers if needed
      //   },
      //   body: JSON.stringify(formData)
      // });

      if (response.ok) {
        setSubmitMessage("House added successfully!");
        // Reset form
        setFormData({
          rent: "",
          beds: "",
          baths: "",
          square_feet: "",
          address: "",
          description: "",
          contact: "",
          More_infomation: "",
        });
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New House Listing
      </h2>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bedrooms and Bathrooms - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="beds"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number Of Bedrooms
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Square Feet */}
        <div>
          <label
            htmlFor="square_feet"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sq. Ft
          </label>
          <input
            type="number"
            id="square_feet"
            name="square_feet"
            value={formData.square_feet}
            onChange={handleChange}
            placeholder="eg. 1200"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
            placeholder="Describe the property features, amenities, etc."
            rows="4"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Number
          </label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="eg. 1234567890"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* More Information URL */}
        <div>
          <label
            htmlFor="More_infomation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            More Information (Optional URL)
          </label>
          <input
            type="url"
            id="More_infomation"
            name="More_infomation"
            value={formData.More_infomation}
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
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? "Adding House..." : "Add House Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}

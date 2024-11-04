"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import
import Link from "next/link";
import ErrorMessage from "@components/ErrorMessage";
import DescriptionSection from "./DescriptionSection";
import ImageUploader from "./ImageUploader";
import AddressSection from "./AddressSection";
import PriceOfferSection from "./PriceOfferSection";
import PropertiesSection from "./PropertiesSection";
import LoadingModal from "./LoadingModal"; // Import the LoadingModal component

export default function EntityForm() {
  const router = useRouter(); // Initialize the router
  const [images, setImages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading modal
  const checkboxItems = [
    "Schuppen",
    "Grillstelle",
    "Garage",
    "Garten",
    "Balkon",
    "Swimmingpool",
    "Sauna",
    "Carport",
    "Fitnessraum",
    "Terrasse",
    "Kamin",
    "Spielplatz",
  ];

  const [formData, setFormData] = useState({
    size: "",
    description: "",
    street: "",
    city: "",
    country: "",
    plz: "",
    price: "",
    type: "Gütle",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Show loading modal
    const token = localStorage.getItem("access_token");

    if (!termsAccepted) {
      setError("Sie müssen die Nutzungsbedingungen akzeptieren.");
      setIsLoading(false); // Hide loading modal
      return;
    }

    const data = {
      address: {
        country: formData.country,
        city: formData.city,
        plz: formData.plz.toString(),
        street: formData.street,
      },
      meta: {
        type: formData.type,
        size: formData.size,
        price: formData.price,
        description: formData.description,
      },
      properties,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entities/create_entity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
        );
      }

      const result = await response.json();
      const entityId = result; // Assuming the API response includes the created entity's ID
      console.log("Form Data Submitted:", result);

      // Upload each image with the entity_id
      await uploadImages(entityId);

      // Hide loading modal
      setIsLoading(false);

      // Redirect to the desired URL
      router.push(`/venues/${entityId}`); // Update with your desired URL

    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
      setIsLoading(false); // Hide loading modal
    }
  };

  const uploadImages = async (entityId) => {
    const token = localStorage.getItem("access_token");

    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image.file); // Use the File object

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/entities/upload/${entityId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`, // No Content-Type; let FormData set it
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(
            `Fehler beim Hochladen des Bildes: ${
              errorData.detail || "Unbekannter Fehler"
            }`
          );
        }

        const result = await response.json();
        console.log("Image Uploaded:", result);
      } catch (error) {
        console.error("Image upload error:", error);
        setError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Loading Modal */}
      <LoadingModal isLoading={isLoading} />

      <div className="space-y-12">
        {/* Description Section */}
        <DescriptionSection formData={formData} setFormData={setFormData} />

        {/* Image Uploader */}
        <ImageUploader selectedImages={images} setSelectedImages={setImages} />

        {/* Address Section */}
        <AddressSection formData={formData} setFormData={setFormData} />

        {/* Price and Offer Section */}
        <PriceOfferSection formData={formData} setFormData={setFormData} />

        {/* Properties Section */}
        <PropertiesSection
          checkboxItems={checkboxItems}
          selectedProperties={properties}
          setSelectedProperties={setProperties}
        />
      </div>
      {/* Form Actions */}
      <div className="mt-6">
        <div className="flex items-center">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label
            htmlFor="termsAccepted"
            className="ml-3 block text-sm text-gray-800"
          >
            Ich akzeptiere die{" "}
            <Link href="#" className="font-semibold orange_text">
              Nutzungsbedingungen
            </Link>
          </label>
        </div>
        <ErrorMessage message={error} />
        <button
          type="submit"
          className="mt-4 black_btn text-white text-sm font-semibold py-3.5 rounded-md"
        >
          Veröffentlichen und speichern
        </button>
      </div>
    </form>
  );
}

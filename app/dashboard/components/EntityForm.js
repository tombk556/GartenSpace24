"use client";

import React, { useState } from "react";
import Link from "next/link";
import ErrorMessage from "@components/ErrorMessage";
import DescriptionSection from "./DescriptionSection";
import ImageUploader from "./ImageUploader";
import AddressSection from "./AddressSection";
import PriceOfferSection from "./PriceOfferSection";
import PropertiesSection from "./PropertiesSection";

export default function EntityForm() {
  const [images, setImages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
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
    size: 0,
    description: "",
    street: "",
    city: "",
    country: "",
    plz: 0,
    price: "",
    type: "Gütle",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Sie müssen die Nutzungsbedingungen akzeptieren.");
      return;
    }

    // Log out all the data of the form
    const data = {
      ...formData,
      images,
      properties,
    };
    console.log("Form Data Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {/* Description Section */}
        <DescriptionSection formData={formData} setFormData={setFormData} />

        {/* Image Uploader */}
        <ImageUploader
          selectedImages={images}
          setSelectedImages={setImages}
        />

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

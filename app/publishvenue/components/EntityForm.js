"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ErrorMessage from "@components/ErrorMessage";
import DescriptionSection from "./DescriptionSection";
import ImageUploader from "./ImageUploader";
import AddressSection from "./AddressSection";
import PriceOfferSection from "./PriceOfferSection";
import PropertiesSection from "./PropertiesSection";
import LoadingModal from "./LoadingModal";

export default function EntityForm() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const checkboxItems = [
    "Schuppen",
    "Grillstelle",
    "Garage",
    "Garten",
    "Swimmingpool",
    "Balkon",
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
    country: "Baden-Württemberg",
    plz: "",
    price: "",
    type: "Gütle",
    offer: "Pachten"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 
    const token = localStorage.getItem("access_token");

    if (!termsAccepted) {
      setError("Sie müssen die Nutzungsbedingungen akzeptieren.");
      setIsLoading(false); 
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
        offer: formData.offer,
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
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }

      const result = await response.json();
      const entityId = result.id;
      console.log("Form Data Submitted:", result);

      await uploadImages(entityId);

      setIsLoading(false);

      router.push(`/venues/${entityId}`);

    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const uploadImages = async (entityId) => {
    const token = localStorage.getItem("access_token");

    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image.file);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/entities/upload/${entityId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
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
      <LoadingModal isLoading={isLoading} />

      <div className="space-y-12">
        <DescriptionSection formData={formData} setFormData={setFormData} />

        <ImageUploader selectedImages={images} setSelectedImages={setImages} />

        <AddressSection formData={formData} setFormData={setFormData} />

        <PriceOfferSection formData={formData} setFormData={setFormData} />

        <PropertiesSection
          checkboxItems={checkboxItems}
          selectedProperties={properties}
          setSelectedProperties={setProperties}
        />
      </div>
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

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ErrorMessage from "@components/ErrorMessage";
import AddressSection from "./AddressSection";
import PropertiesSection from "./PropertiesSection";
import LoadingModal from "@app/publishvenue/components/LoadingModal";
import PriceOfferSection from "./PriceOfferSection";
import DescriptionSection from "./DescriptionSection";

export default function EntityForm() {
  const router = useRouter();
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
    description: "",
    city: "",
    country: "",
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
        plz: formData.plz.toString(),
        city: formData.city,
        country: formData.country,
        city: formData.city,
        description: formData.description,
        attributes: properties,
        type: formData.type,
        offer: formData.offer
    };

    try {
        console.log(data);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/advert/create_advert`,
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
      const advertID = result.id;

      setIsLoading(false);
      router.push(`/displayadverts/${advertID}`);

    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <LoadingModal isLoading={isLoading} />

      <div className="space-y-12">
        <DescriptionSection formData={formData} setFormData={setFormData} />
        <AddressSection formData={formData} setFormData={setFormData} />
        <PropertiesSection
          checkboxItems={checkboxItems}
          selectedProperties={properties}
          setSelectedProperties={setProperties}
        />
        <PriceOfferSection formData={formData} setFormData={setFormData} />
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
            <Link href="#" className="font-semibold hover:underline">
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

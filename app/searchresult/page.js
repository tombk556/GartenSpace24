"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyDisplay from "./components/PropertyDisplay";
import SearchBar from "@components/SearchBar";
import { FaSpinner } from "react-icons/fa"; // Import Spinner Icon

export default function SuchergebnissePage() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const offer = searchParams.get("offer");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/entities/get_all_entities?search=${search}&offer=${offer}`
        );
        const data = await res.json();
        setEntities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (search && offer) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [search, offer]);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 mt-20">
      <h1 className="text-5xl font-bold">Suchergebnisse</h1>
      <p className="text-xl text-gray-700">
        {loading ? "Lade Ergebnisse..." : `${entities.length} Kleingärten gefunden`}
      </p>
      <SearchBar defaultOffer={offer} defaultSearchTerm={search} />
      <br />
      {loading ? (
        <FaSpinner className="animate-spin text-gray-700 text-4xl" />
      ) : entities.length === 0 ? (
        <p className="mt-4 text-2xl text-gray-700">Keine Kleingärten für die Suche gefunden.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {entities.map((entity) => (
            <PropertyDisplay key={entity.id} property={entity} />
          ))}
        </div>
      )}
    </div>
  );
}

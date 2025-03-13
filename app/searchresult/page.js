"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyDisplay from "../displayvenues/components/PropertyDisplay";

export default function SuchergebnissePage() {
  const [entities, setEntities] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const offer = searchParams.get("offer");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/entities/get_all_entities?search=${search}&offer=${offer}`
        );
        const data = await res.json();
        setEntities(data);
      } catch (error) {
        console.error(error);
      }
    }
    if (search && offer) {
      fetchData();
    }
  }, [search, offer]);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 mt-20">
      <h1 className="text-5xl font-bold">Suchergebnisse</h1>

      {entities.length === 0 && (
        <p className="mt-4 text-2xl text-gray-700">Keine Kleingärten für die Suche gefunden.</p>
      )}

      <ul className="mt-4 max-w-2xl w-full space-y-2 text-left">
        {entities.map((entity) => (
          <PropertyDisplay property={entity} />
        ))}
      </ul>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import useEntities from "./Hooks/useEntities";
import VenueTable from "./components/VenueTable";
import AdvertTable from "./components/AdvertTable";
import ProtectedRoute from "@components/ProtectedRoute";

const Page = () => {
  const { entities, loading, error, deleteEntity } = useEntities();

  if (loading) {
    return <div className="p-4">Lädt...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-4">
        <p className="text-xl orange_text font-bold mb-4">Meine Anzeigen und Anfragen</p>

        {entities.length === 0 ? (
          <div className="text-gray-700">
            Sie haben keine Anzeigen.{" "}
            <Link href="/publishentity" className="orange_text hover:underline">
              Jetzt Anzeige oder Anfrage erstellen
            </Link>
          </div>
        ) : (
          <div>
          <VenueTable entities={entities} onDelete={deleteEntity} />

          <AdvertTable entities={entities} onDelete={deleteEntity} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;

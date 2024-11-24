"use client";

import React from "react";
import Link from "next/link";
import useEntities from "./useEntities";
import EntityTable from "./EntityTable";

const page = () => {
  const { entities, loading, error, deleteEntity } = useEntities();

  if (loading) {
    return <div className="p-4">Lädt...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <p className="text-xl orange_text font-bold mb-4">Meine Anzeigen</p>

      {entities.length === 0 ? (
        <div className="text-gray-700">
          Sie haben keine Anzeigen.{" "}
          <Link href="/publishentity" className="orange_text hover:underline">
            Jetzt Anzeige erstellen
          </Link>
        </div>
      ) : (
        <EntityTable entities={entities} onDelete={deleteEntity} />
      )}
    </div>
  );
};

export default page;

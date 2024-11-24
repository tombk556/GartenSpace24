"use client";

import React from "react";
import Link from "next/link";
import useEntities from "./Hooks/useEntities";
import EntityTable from "./components/EntityTable";
import ProtectedRoute from "@components/ProtectedRoute";

const Page = () => {
  const { entities, loading, error, deleteEntity } = useEntities();

  if (loading) {
    return <div className="p-4">Lädt...</div>;
  }

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
};

export default Page;

"use client";

import React from "react";
import Link from "next/link";
import useEntities from "./Hooks/useVenues";
import useAdverts from "./Hooks/useAdverts";
import VenueTable from "./components/VenueTable";
import AdvertTable from "./components/AdvertTable";
import ProtectedRoute from "@components/ProtectedRoute";
import { FaSpinner } from "react-icons/fa";

const Page = () => {
  const { entities, loading, error, deleteEntity } = useEntities();
  const { adverts, loadingAdverts, errorAdverts, deleteAdvert } = useAdverts();

  if (loading || loadingAdverts) {
    return (
      <div className="p-4">
        <FaSpinner className="animate-spin text-gray-700 text-4xl" />
      </div>
    );
  }

  let content;

  if (entities.length === 0 && adverts.length === 0) {
    content = (
      <div className="text-gray-700">
        Sie haben keine Anzeigen. Jetzt eine{" "}
        <Link href="/publishvenue" className="green_text hover:underline">
          Anzeige
        </Link>
        {" oder eine "}
        <Link href="/publishadvert" className="green_text hover:underline">
          Anfrage
        </Link>
      </div>
    );
  } else if (entities.length > 0 && adverts.length === 0) {
    content = <VenueTable entities={entities} onDelete={deleteEntity} />;
  } else if (adverts.length > 0 && entities.length === 0) {
    content = <AdvertTable adverts={adverts} onDelete={deleteAdvert} />;
  } else {
    content = (
      <div>
        <VenueTable entities={entities} onDelete={deleteEntity} />
        <br />
        <AdvertTable adverts={adverts} onDelete={deleteAdvert} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-4">
        <p className="text-xl green_text font-bold mb-4">
          Meine Anzeigen und Anfragen
        </p>
        {content}
      </div>
    </ProtectedRoute>
  );
};

export default Page;

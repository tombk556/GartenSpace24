"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@app/venues/Hooks";
import { SquareMeter } from "@app/venues/Hooks";
import Link from "next/link";

const Page = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);     // Added error state

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entities/get_user_entities`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(response => response.json())
        .then(data => {
          setEntities(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          setError("Fehler beim Laden der Daten");
          setLoading(false);
        });
    } else {
      console.error("No access token found");
      setError("Authentifizierungsfehler");
      setLoading(false);
    }
  }, []);

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
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
                Größe
              </th>
              <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
                Preis
              </th>
              <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
                Beschreibung
              </th>
              <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entities.map(entity => (
              <tr key={entity._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 hover:underline">
                  <Link href={`/venues/${entity._id}`}>
                    {entity._id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {entity.meta.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {SquareMeter(entity.meta.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatCurrency(entity.meta.price)}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                  {entity.meta.description}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                  <button
                    onClick={() => handleDelete(entity._id)}
                    className="text-red-700 hover:text-red-800 font-medium"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  function handleDelete(id) {
    if (window.confirm("Möchten Sie diese Anzeige wirklich löschen?")) {
      const token = localStorage.getItem("access_token");
      if (token) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/entities/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then(response => {
            if (response.ok) {
              // Remove the deleted entity from the state
              setEntities(prevEntities =>
                prevEntities.filter(entity => entity._id !== id)
              );
              console.log("Anzeige erfolgreich gelöscht");
            } else {
              console.error("Fehler beim Löschen der Anzeige");
            }
          })
          .catch(error => console.error("Error deleting entity:", error));
      } else {
        console.error("No access token found");
      }
    }
  }
};

export default Page;

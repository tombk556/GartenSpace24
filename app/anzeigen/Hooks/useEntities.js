// useEntities.js
import { useState, useEffect } from 'react';

function useEntities() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

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

  const deleteEntity = (id) => {
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
  };

  return { entities, loading, error, deleteEntity };
}

export default useEntities;

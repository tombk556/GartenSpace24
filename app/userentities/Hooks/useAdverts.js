import { useState, useEffect } from 'react';

function useAdverts() {
  const [adverts, setAdverts] = useState([]);
  const [loadingAdverts, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/advert/get_user_adverts`,
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
          setAdverts(data);
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

  const deleteAdvert = (id) => {
    if (window.confirm("Möchten Sie diese Anzeige wirklich löschen?")) {
      const token = localStorage.getItem("access_token");
      if (token) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/advert/delete/${id}`,
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
              setAdverts(prevEntities =>
                prevEntities.filter(entity => entity.id !== id)
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

  return { adverts, loadingAdverts, error, deleteAdvert };
}

export default useAdverts;

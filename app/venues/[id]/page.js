"use client";

import React, { useEffect, useState } from "react";
import PropertyCard from "../PropertyCard";
import ImageCard from "../ImageCard";

const Page = () => {
  const [id, setId] = useState("");
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    setId(id);

    const fetchProperty = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/entities/get_entity/" + id
        );
        const data = await response.json();
        setProperty(data);

        if (data.images) {
          const imagePromises = Object.keys(data.images).map(async (key) => {
            const fileId = data.images[key];
            const imageResponse = await fetch(
              `http://localhost:8000/entities/download/${id}/${fileId}`
            );
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { name: key, url: imageUrl };
          });

          const imageUrls = await Promise.all(imagePromises);
          setImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperty();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <PropertyCard property={property} />
      <ImageCard images={images} />

    </div>
  );
};

export default Page;

"use client";

import React, { useEffect, useState } from "react";
import PropertyCard from "../PropertyCard";

const Page = () => {
  const [id, setId] = useState("");
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    setId(id);

    const fetchProperty = async () => {
      try {
        const response = await fetch('http://localhost:8000/entities/get_entity/' + id);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperty();

  }, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id}</h1>
      {property && (
        <PropertyCard property={property} />
      )}
    </div>
  );
};

export default Page;

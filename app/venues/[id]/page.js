"use client";

// app/venues/[id]/page.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from '../PropertyCard';

// Dummy data for properties (in a real app, you would fetch this from a database)
const properties = [
  {
    _id: "66c9a334770867b7aa65ef68",
    address: {
      country: "Muserland",
      city: "Musterstadt",
      plz: "12345",
      street: "Musterstraße",
    },
    meta: {
      type: "House",
      size: "100m²",
      rooms: 4,
      price: "100000€",
      description: "This is a beautiful house",
    },
    properties: {
      garden: true,
      garage: true,
      toilette: false,
    },
  },
  // Add more properties here if needed
];

const page = () => {
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (router) {
        const id = window.location.pathname.split("/").pop(); // Extract ID from URL
  
        const foundProperty = properties.find((prop) => prop._id === id);
        setProperty(foundProperty);
        setIsLoading(false);
      }
    }, [router]);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!property) {
      return <div>Property not found</div>;
    }
  
    return (
      <div className="container mx-auto p-4">
        <PropertyCard property={property} />
      </div>
    );
  };

export default page;

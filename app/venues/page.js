"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Page = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entities/get_all_entities`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property._id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{property.meta.type}</h2>
            <p className="text-orange-600">ID: {property._id}</p>
            <p className="text-gray-600">Size: {property.meta.size}</p>
            <p className="text-gray-600">Rooms: {property.meta.rooms}</p>
            <p className="text-gray-600">Price: {property.meta.price}</p>
            <Link className="text-blue-500 mt-2 inline-block" href={`/venues/${property._id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

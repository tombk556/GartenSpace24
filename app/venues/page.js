"use client";
import React, { useEffect, useState } from 'react';
import PropertyDisplay from './components/PropertyDisplay';

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
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          {properties.map((property) => (
             <PropertyDisplay key={property._id} property={property}/>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;

import React from 'react';
import Link from 'next/link';

const properties = [
  {
    _id: "66c9a334770867b7aa65ef68",
    meta: {
      type: "House",
      size: "100m²",
      rooms: 4,
      price: "100000€",
      description: "This is a beautiful house",
    },
  },
];

const page = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property._id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{property.meta.type}</h2>
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

export default page;

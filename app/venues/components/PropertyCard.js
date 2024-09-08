import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{property.meta.type}</h2>
        <p className="text-gray-600">{property.meta.description}</p>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-medium">Details</h3>
        <ul className="mt-2">
          {Object.entries(property.meta).map(([key, value]) => (
            <li key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
            </li>
          ))}
          <li>
            <strong>Location:</strong> {property.address.street}, {property.address.city}, {property.address.plz}, {property.address.country}
          </li>
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-medium">Properties</h3>
        <ul className="mt-2">
          {Object.entries(property.properties).map(([key, value]) => (
            <li key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PropertyCard;

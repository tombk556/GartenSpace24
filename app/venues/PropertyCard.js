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
          <li><strong>Size:</strong> {property.meta.size}</li>
          <li><strong>Rooms:</strong> {property.meta.rooms}</li>
          <li><strong>Price:</strong> {property.meta.price}</li>
          <li><strong>Location:</strong> {property.address.street}, {property.address.city}, {property.address.plz}, {property.address.country}</li>
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-medium">Properties</h3>
        <ul className="mt-2">
          <li><strong>Garden:</strong> {property.properties.garden ? 'Yes' : 'No'}</li>
          <li><strong>Garage:</strong> {property.properties.garage ? 'Yes' : 'No'}</li>
          <li><strong>Toilette:</strong> {property.properties.toilette ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyCard;

import React from "react";

const PropertyHeader = ({ property }) => {
  return (
    <div>
      <p className="text-l mb-4 mt-1">
        Von Nuzter: <b>{property.username}</b>
      </p>
      <h1 className="text-2xl mb-4 font-light mt-5">{property.description}</h1>
    </div>
  );
};

export default PropertyHeader;

import React from "react";

const PropertyHeader = ({ property }) => {
  return (
    <div>
      <h1 className="text-2xl mb-4 font-light mt-5">
        {property.meta.type} - {property.address.city}:{" "}
        {property.meta.description}
      </h1>
    </div>
  );
};

export default PropertyHeader;

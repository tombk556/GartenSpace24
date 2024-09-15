import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { formatCurrency, calculatePricePerSquareMeter, SquareMeter } from "../Hooks";
const PlacePriceCard = ({ property }) => {

  return (
    <div className="grid grid-cols-3">
      <div>
        <div className="text-xl flex items-center">
          <FaLocationDot className="mr-2" />
          <p className="font-semibold">Adresse</p>
        </div>
        <p className="text-s">
          {property.address.city} - {property.address.plz}
        </p>
        <div className="mt-1 text-xs">
          <p>*Die vollständige Adresse</p>
          <p>erhalten Sie vom Anbieter</p>
        </div>
      </div>
      <div>
        <p className="text-xl font-bold">
          {formatCurrency(property.meta.price)}
        </p>
        <p className="text-s">
          {calculatePricePerSquareMeter(
            property.meta.price,
            property.meta.size
          )}
        </p>
      </div>
      <div>
        <p className="text-xl font-bold">
          {SquareMeter(
            property.meta.size
          )}
        </p>
        <p className="text-s">
            Grundstücksfläche
        </p>
      </div>
    </div>
  );
};

export default PlacePriceCard;

import React from "react";
import { FaLocationDot } from "react-icons/fa6";

const PlacePriceCard = ({ property }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const calculatePricePerSquareMeter = (totalPrice, size) => {
    const pricePerSquareMeter = totalPrice / size;
  
    const formattedPricePerSquareMeter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(pricePerSquareMeter);
  
    return `Kaufpreis: ${formattedPricePerSquareMeter}/m²`;
  };
  
  const SquareMeter = (size) => {
    return `${size} m²`
  }    

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
          <p>der Immobilie erhalten</p>
          <p>Sie vom Anbieter.</p>
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

import React from "react";
import Link from "@node_modules/next/link";
import {
  FaLocationDot,
  FaHouseChimney,
  FaEnvelope
} from "react-icons/fa6";
const PlacePriceCard = ({ property }) => {
  return (
    <div className="grid grid-cols-4 mt-3">
      <div>
        <div className="text-xl flex items-center">
          <FaLocationDot className="mr-2" />
          <p className="font-semibold">Adresse</p>
        </div>
        <p className="text-s">
          {property.city} - {property.plz}
        </p>
      </div>
      <div>
        <div className="text-xl flex items-center">
          <FaHouseChimney className="mr-2" />
          <p className="font-semibold">Eigenschaften</p>
        </div>
        <span className="text-xs text-gray-700">
          {property.attributes.join(", ")}
        </span>
      </div>

      <div>
      <Link
          type="submit"
          href={`mailto:${property.email}`}
          className="border-2 border-black py-2 px-10 w-48 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-200"
        >
          <FaEnvelope size={20} className="mr-2" />
          Kontakt
        </Link>
      </div>

    </div>
  );
};

export default PlacePriceCard;

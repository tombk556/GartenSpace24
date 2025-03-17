"use client";

import { FaLocationDot } from "react-icons/fa6";
import Link from "@node_modules/next/link";

export default function PropertyDisplay({ property }) {
  const formattedDate = new Date(property.date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Link href={`/displayadverts/${property.id}`}>
      <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-lg shadow-md bg-white w-80 h-80 mx-auto">
        <div className="text-center mb-4 flex-1 flex items-center justify-center">
          <p className="text-lg font-bold text-gray-800">
            {property.description}
          </p>
        </div>

        <div className="flex items-center justify-center text-gray-700 text-sm mb-4">
          <FaLocationDot className="mr-2 black" />
          <p>
            {property.city} - {property.plz}
          </p>
        </div>
        <div className="text-sm text-gray-600 text-center">
          <p>
            <span className="font-semibold">Von:</span> {property.username}
          </p>
          <p>
            <span className="font-semibold">Datum:</span> {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";

export default function PropertyDisplay({ property }) {

  return (
    <div className="flex flex-wrap justify-center items-start p-4 border-2 border-gray-300 rounded-lg">
      <div className="w-full md:w-1/2 md:pl-4">
          <div className="text-l text-gray-700 p-4 mb-4 font-bold">
            <p>{property.description}</p>
          </div>
          <div className="text-s text-gray-700 p-4 mb-4 font-thin inline-flex items-center">
            <FaLocationDot className="mr-2" />
            <p>
              {property.city} - {property.plz}
            </p>
          </div>
          <div className="flex justify-around space-x-4">
            <div>
              <p className="text-xs">{property.offer}</p>
            </div>
            <div>
            </div>
          </div>
      </div>
    </div>
  );
}

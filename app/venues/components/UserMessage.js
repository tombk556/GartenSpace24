import React from "react";
import { FaUserCheck } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const UserMessage = ({ property }) => {
  return (
    <div className="p-4 w-full border-2 border-gray-300 rounded-lg max-w-md">
      <div className="mt-10">
        <p className="text-gray-700">
          Veröffentlicht am {formatDate(property.date)} von Nutzer:
        </p>
        <h2 className="font-semibold text-gray-900">
          {property.userId}
        </h2>
        <p className="text-gray-700 flex items-center">
          Identität verifiziert{" "}
          <FaUserCheck className="ml-2" size={19} color="green" />
        </p>
      </div>
      <hr className="border border-gray-700 mt-20" />
      
      {/* First Button: Nachricht */}
      <div className="flex justify-center mt-20">
        <button
          type="submit"
          className="border-2 border-black py-2 px-10 w-48 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-200"
        >
          <FaEnvelope size={20} className="mr-2" />
          Nachricht
        </button>
      </div>

      {/* Second Button: Merken */}
      <div className="flex justify-center mt-5">
        <button
          type="submit"
          className="border-2 border-black py-2 px-10 w-48 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-200"
        >
          <FaHeart size={20} className="mr-2" />
          Merken
        </button>
      </div>

      {/* Additional Buttons: Teilen, Drucken, Melden */}
      <div className="text-s flex justify-around mt-10 space-x-4">
        {/* Teilen Button */}
        <button className="flex items-center text-gray-900">
          <FaShareAlt className="mr-1" />
          <span className="hover:underline">Teilen</span>
        </button>

        {/* Drucken Button */}
        <button className="flex items-center text-gray-900">
          <FaPrint className="mr-1" />
          <span className="hover:underline">Drucken</span>
        </button>

        {/* Melden Button */}
        <button className="flex items-center text-gray-900">
          <FaExclamationTriangle className="mr-1" />
          <span className="hover:underline">Melden</span>
        </button>
      </div>
    </div>
  );
};

export default UserMessage;

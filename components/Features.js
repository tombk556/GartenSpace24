import React from "react";
import { FaSeedling, FaSearch, FaShieldAlt } from "react-icons/fa";

const Features = () => {
  return (
    <div className="mr-40 ml-40 mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-40">
      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaSeedling className="text-[#009243] text-4xl mb-3" />
        <h3 className="text-xl font-semibold">Kleingarten anbieten</h3>
        <p className="text-gray-700 text-lg mt-2 text-center">
          Stelle dein Kleingarten online und finde schnell einen passenden Käufer, Pächter oder Mieter.
        </p>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaSearch className="text-blue-700 text-4xl mb-3" />
        <h3 className="text-xl font-semibold">Nach Gärten suchen</h3>
        <p className="text-gray-700 text-lg mt-2 text-center">
          Durchsuche verschiedene Angebote in deiner Region und finde dein
          passenden Kleingarten.
        </p>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaShieldAlt className="text-gray-800 text-4xl mb-3" />
        <h3 className="text-xl font-semibold">Sichere Vermittlung</h3>
        <p className="text-gray-700 text-lg mt-2 text-center">
          Profitiere von einem einfachen und sicheren Vermittlungsprozess.
        </p>
      </div>
    </div>
  );
};

export default Features;
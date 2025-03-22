import React from "react";
import Link from "@node_modules/next/link";
import {
  FaSeedling,
  FaSearch,
  FaShieldAlt,
  FaPlus,
  FaFileSignature,
  FaCoins,
} from "react-icons/fa";

const Features = () => {
  return (
    <div className="mr-40 ml-40 mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaSeedling className="text-[#009243] text-4xl mb-3" />
        <Link href="/publishvenue">
          <h3 className="text-xl font-semibold">Kleingarten anbieten</h3>
          <p className="text-gray-700 text-lg mt-2 text-center">
            Stelle deinen Kleingarten online und finde schnell einen passenden
            Käufer, Pächter oder Mieter.
          </p>
        </Link>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaSearch className="text-blue-700 text-4xl mb-3" />
        <Link href={"/searchresult?search=Baden-Württemberg"}>
          <h3 className="text-xl font-semibold">Nach Gärten suchen</h3>
          <p className="text-gray-700 text-lg mt-2 text-center">
            Durchsuche verschiedene Angebote in deiner Region und finde deinen
            Wunschkleingarten.
          </p>
        </Link>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaPlus className="text-gray-800 text-4xl mb-3" />
        <Link href={"/publishadvert"}>
          <h3 className="text-xl font-semibold">Suchanfrage erstellen</h3>
          <p className="text-gray-700 text-lg mt-2 text-center">
            Erstelle kostenlos eine Suchanzeige und lass dich von
            Gartenanbietern finden.
          </p>
        </Link>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaShieldAlt className="text-gray-700 text-4xl mb-3" />
        <h3 className="text-xl font-semibold">Sichere Vermittlung</h3>
        <p className="text-gray-700 text-lg mt-2 text-center">
          Profitiere von einem transparenten, sicheren und effizienten
          Vermittlungsprozess.
        </p>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaFileSignature className="text-red-700 text-4xl mb-3" />
        <h3 className="text-xl font-semibold">Digitale Vertragsvorlagen</h3>
        <p className="text-gray-700 text-lg mt-2 text-center">
          Nutze rechtssichere, digital ausfüllbare Vorlagen für Miet-, Kauf-
          oder Pachtverträge.
        </p>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <FaCoins className="text-yellow-600 text-4xl mb-3" />
        <h3 className="text-xl font-semibold">Digitale Bezahlung</h3>
        <p className="text-gray-700 text-lg mt-2 text-center">
          Abwicklung von Zahlungen direkt über die Plattform – sicher, schnell
          und transparent.
        </p>
      </div>
    </div>
  );
};

export default Features;

"use client";

import { useEffect, useState, useRef } from "react";
const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef(null);

  useEffect(() => {
    if (!featureRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log("Feature Section sichtbar:", entry.isIntersecting);
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // 20% Sichtbarkeit
    );

    observer.observe(featureRef.current);

    return () => {
      if (featureRef.current) observer.unobserve(featureRef.current);
    };
  }, []);


  return (
    <>
      {/* Hero Section mit Suchleiste */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl font-bold">
          <span className="text-green-600">Endlich im Garten.</span>
        </h1>
        <p className="text-2xl text-gray-700 mt-4 max-w-xl">
          GartenSpace24 ist die Plattform für die einfache und sichere Vermittlung von Kleingärten in Deutschland.
        </p>

        {/* Suchleiste */}
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Ort oder PLZ eingeben"
            className="border rounded-lg p-3 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />

          {/* Custom Dropdown */}
          <div className="relative w-full md:w-1/3">
            <select
              className="appearance-none border rounded-lg p-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer text-lg transition duration-200 ease-in-out"
            >
              <option value="Mieten">Mieten</option>
              <option value="Kaufen">Kaufen</option>
              <option value="Pachten">Pachten</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-lg">
              ⌄
            </div>
          </div>

          {/* Suchbutton */}
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition duration-200 ease-in-out w-full md:w-auto"
          >
            Suchen
          </button>
        </div>
      </section>

      {/* Features Section (erscheint erst beim Scrollen) */}
      <section
        ref={featureRef}
        className={`w-full max-w-5xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-green-600 text-5xl font-semibold text-center">Warum GardenSpace24?</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Kleingarten anbieten</h3>
            <p className="text-gray-600 text-sm mt-2">
              Stelle dein Grundstück online und finde schnell einen passenden Käufer oder Pächter.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Nach Gärten suchen</h3>
            <p className="text-gray-600 text-sm mt-2">
              Durchsuche zahlreiche Kleingarten-Angebote in deiner Region.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Sichere Vermittlung</h3>
            <p className="text-gray-600 text-sm mt-2">
              Profitiere von einem einfachen und sicheren Vermittlungsprozess.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

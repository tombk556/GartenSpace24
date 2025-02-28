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
      {/* Hero Section: nimmt die volle Höhe des Viewports ein */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold">
          <span className="green_text">Endlich im Garten.</span>
        </h1>
        <p className="text-2xl text-gray-700 mt-4 max-w-xl">
          GartenSpace24 ist die Plattform für die einfache und sichere Vermittlung von Kleingärten in Deutschland.
        </p>
      </section>

      {/* Features Section (erscheint erst beim Scrollen) */}
      <section
        ref={featureRef}
        className={`w-full max-w-5xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="green_text text-5xl font-semibold text-center">Warum GardenSpace24?</h2>
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

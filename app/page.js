"use client";

import SearchBar from "@components/SearchBar";
import Features from "@components/Features";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center text-center px-6 mt-20">
      <h1 className="text-5xl font-bold">
        <span className="green_text">Endlich im Garten.</span>
      </h1>
      <p className="text-2xl text-gray-700 mt-4 max-w-xl">
        GartenSpace24 ist die Plattform für die einfache und sichere Vermittlung
        von Kleingärten in Deutschland.
      </p>
      <SearchBar />
      <Features />
    </div>
  );
};

export default Home;

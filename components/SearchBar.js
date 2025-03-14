"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";

const SearchBar = ({ defaultSearchTerm = "", defaultOffer = "Pachten" }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [offer, setOffer] = useState(defaultOffer);

  const handleSearch = () => {
    router.push(`/searchresult?search=${searchTerm}&offer=${offer}`);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSearch();
    }}>
      <div className="mt-10 bg-white rounded-lg p-2 w-[800px] border-2 border-black transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <div className="flex flex-col md:flex-row items-center w-full">
          <input
            type="text"
            required
            placeholder="Ort, Stadt, Land oder PLZ eingeben"
            className="p-2 w-full text-xl outline-none border-r-2 border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="relative w-full md:w-1/3">
            <select
              className="appearance-none rounded-none p-3 w-full bg-white outline-none text-xl"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            >
              <option value="Pachten">Pachten</option>
              <option value="Kaufen">Kaufen</option>
              <option value="Mieten">Mieten</option>
            </select>
            <FaAngleDown className="absolute inset-y-4 right-2" size={20} />
          </div>
          <div>
            <button
              type="submit"
              className="ml-2 bg-[#009243] text-white text-l px-4 py-2 rounded-2xl hover:bg-green-800 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Suchen
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;

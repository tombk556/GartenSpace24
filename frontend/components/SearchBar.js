"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";

const SearchBar = ({ defaultSearchTerm = "", defaultOffer = "Pachten" }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [offer, setOffer] = useState(defaultOffer);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then((data) => setAllCities(data))
      .catch((err) => console.error("Failed to load cities.json", err));
  }, []);


  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredCities([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allCities.filter((item) => {
      const combinedFields = (
        item.city +
        " " +
        item.plz +
        " " +
        item.country
      ).toLowerCase();
      return combinedFields.includes(value.toLowerCase());
    });

    setFilteredCities(filtered);
    setShowSuggestions(true);
  };


  const handleSuggestionClick = (suggestion) => {
    const combinedValue = `${suggestion.city}, ${suggestion.plz}, ${suggestion.country}`;
    setSearchTerm(combinedValue);
    setFilteredCities([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/searchresult?search=${searchTerm}&offer=${offer}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10">
      <div className="mt-10 bg-white rounded-lg p-2 w-[800px] border-2 border-black transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <div className="flex flex-col md:flex-row items-center w-full">
          <div className="w-full relative">
            <input
              type="text"
              required
              placeholder="Ort, Stadt, Land oder PLZ eingeben"
              className="p-2 w-full text-xl outline-none border-r-2 border-black"
              value={searchTerm}
              onChange={handleInputChange}
            />
            {showSuggestions && filteredCities.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="text-left absolute z-50 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto shadow-lg"
              >
                {filteredCities.map((item, idx) => (
                  <li
                    key={`${item.city}-${item.plz}-${idx}`}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item.city}, {item.plz}, {item.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
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

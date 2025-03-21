"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyDisplay from "./PropertyDisplay";
import SearchBar from "@components/SearchBar";
import { FaSpinner } from "react-icons/fa";
import NoResultPage from "./NoResultPage";

export default function SearchResultPage() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const offer = searchParams.get("offer");
  const limit = 20;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [search, offer]);

  useEffect(() => {
    fetchData(page);
  }, [page, search, offer]);

  async function fetchData(currentPage) {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * limit;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entities/get_all_entities?search=${search}&offer=${offer}&skip=${skip}&limit=${limit}`
      );
      const data = await res.json();

      setEntities(data.entities);
      setTotalPages(Math.ceil(data.total_count / limit));
      setTotalCount(data.total_count);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function renderPagination() {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center mt-6 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md ${
            page === 1 ? "bg-gray-300" : "text-white bg-[#009243] hover: hover:bg-green-800 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
          }`}
        >
          Zurück
        </button>

        {pages.map((p, index) =>
          p === "..." ? (
            <span key={index} className="px-3 py-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-md ${
                page === p ? "text-white bg-[#009243] " : "bg-gray-300 hover: hover:transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md ${
            page === totalPages ? "bg-gray-300" : "text-white bg-[#009243] hover: hover:bg-green-800 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
          }`}
        >
          Weiter
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 mt-20">
      <h1 className="text-5xl font-bold">Suchergebnisse</h1>
      <p className="text-xl text-gray-700">
        {loading && entities.length === 0 ? "Lade Ergebnisse..." : `${totalCount} Kleingärten gefunden`}
      </p>
      <SearchBar defaultOffer={offer} defaultSearchTerm={search} />
      <br />
      {loading && entities.length === 0 ? (
        <FaSpinner className="animate-spin text-gray-700 text-4xl" />
      ) : entities.length === 0 ? (
        <NoResultPage />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {entities.map((entity) => (
              <PropertyDisplay key={entity.id} property={entity} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from 'react';
import PropertyDisplay from './components/PropertyDisplay';

const Page = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const propertiesPerPage = 4;

  useEffect(() => {
    const fetchProperties = async () => {
      if (isFirstLoad || !loading) {
        setLoading(true);
        try {
          const skip = (currentPage - 1) * propertiesPerPage;
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advert/get_all_adverts?skip=${skip}&limit=${propertiesPerPage}`);
          const data = await response.json();

          console.log("Fetched properties:", data);

          const newProperties = data.filter(
            (newProp) => !properties.some((existingProp) => existingProp.id === newProp.id)
          );

          if (newProperties.length === 0 || newProperties.length < propertiesPerPage) {
            setHasMore(false);
          }

          setProperties((prevProperties) => [...prevProperties, ...newProperties]);
        } catch (error) {
          console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
          setIsFirstLoad(false);
        }
      }
    };

    fetchProperties();
  }, [currentPage]);

  const loadMoreProperties = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Aktuelle Anfragen</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {properties.map((property) => (
          <PropertyDisplay property={property} key={property.id}/>
        ))}
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreProperties}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More Properties
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;

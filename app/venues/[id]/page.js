"use client";

import React, { useEffect, useState } from "react";
import PropertyCard from "../PropertyCard";
import ImageCarousel from "../ImageCarousel"; // Import the ImageCarousel component

const Page = () => {
  const [id, setId] = useState("");
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    setId(id);

    const fetchProperty = async () => {
      try {
        const response = await fetch('http://localhost:8000/entities/get_entity/' + id);
        const data = await response.json();
        setProperty(data);

        // Fetch images
        if (data.images) {
          const imagePromises = Object.keys(data.images).map(async (key) => {
            const fileId = data.images[key];
            const imageResponse = await fetch(`http://localhost:8000/entities/download/${id}/${fileId}`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { name: key, url: imageUrl };
          });

          const imageUrls = await Promise.all(imagePromises);
          setImages(imageUrls);
        }

      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperty();

  }, []);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id}</h1>
      {property && (
        <PropertyCard property={property} />
      )}

      {images.length > 0 && (
        <div className="image-gallery mt-4">
          <h2 className="text-xl font-bold mb-4">Property Images</h2>
          <div className="grid grid-cols-12 gap-4">
            {images.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className={`col-span-6 md:col-span-4 lg:col-span-${index % 5 === 0 ? '6' : '3'} row-span-${index % 3 === 0 ? '2' : '1'} relative`}
              >
                <img
                  src={image.url}
                  alt={`Property Image ${image.name}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
                  onClick={() => openModal(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Carousel Modal */}
      {isModalOpen && (
        <ImageCarousel
          images={images}
          currentIndex={currentImageIndex}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Page;

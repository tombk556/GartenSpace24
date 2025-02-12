"use client";

import React, { useEffect, useState } from "react";
import ImageCarousel from "../components/ImageCarousel";
import PropertyHeader from "../components/PropertyHeader";
import ImagePlaceholder from "../components/ImagePlaceholder";
import UserMessage from "../components/UserMessage";
import PlacePriceCard from "../components/PlacePriceCard";

const Page = () => {
  const [id, setId] = useState("");
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    setId(id);

    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/entities/get_entity/${id}`
        );
        const data = await response.json();
        setProperty(data);

        if (data.images) {
          const imagePromises = Object.keys(data.images).map(async (key) => {
            const fileId = data.images[key];
            const imageResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/entities/download/${id}/${fileId}`
            );
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { name: key, url: imageUrl };
          });

          const imageUrls = await Promise.all(imagePromises);
          setImages(imageUrls);
          setIsLoadingImages(false);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
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
      <div className="flex flex-col lg:flex-row gap-6">
        {isLoadingImages ? (
          <ImagePlaceholder className="flex-grow lg:w-1/4" />
        ) : (
          <div className="grid grid-cols-3 gap-4 h-510px] overflow-auto flex-grow lg:w-4/5">
            {images.slice(0, 6).map((image, index) => (
              <div key={index} className="w-full h-[240px]">
                <img
                  src={image.url}
                  alt={`Property Image ${image.name}`}
                  className="object-cover w-full h-full rounded-lg shadow-lg cursor-pointer"
                  onClick={() => openModal(index)}
                />
              </div>
            ))}
          </div>
        )}
        {property && (
          <UserMessage
            property={property}
            className="h-[500px] flex-shrink-0 lg:w-1/5"
          />
        )}
      </div>
      <hr className="mt-2" />
      {property && <PropertyHeader property={property} />}
      <hr className="mb-2" />
      {property && <PlacePriceCard property={property} />}
      <hr className="mt-2" />
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

import React, { useState } from "react";

const ImageCarousel = ({ images, currentIndex, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative max-w-3xl w-full bg-white rounded-lg overflow-hidden">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-full"
        >
          ✕
        </button>
        <div className="flex justify-center items-center p-4">
          <button
            onClick={previousImage}
            className="absolute left-2 bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-full"
          >
            ←
          </button>
          <img
            src={images[currentImageIndex].url}
            alt={`Property Image ${images[currentImageIndex].name}`}
            className="max-w-full max-h-[500px] object-contain rounded-lg"
          />
          <button
            onClick={nextImage}
            className="absolute right-2 bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-full"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;

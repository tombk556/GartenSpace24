import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ImageUploader({ selectedImages, setSelectedImages }) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagesWithPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...imagesWithPreviews]);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imagesWithPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...imagesWithPreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = (e, imageToRemove) => {
    e.preventDefault();
    URL.revokeObjectURL(imageToRemove.preview);
    setSelectedImages(selectedImages.filter((image) => image !== imageToRemove));
  };

  return (
    <div className="col-span-full">
      <label htmlFor="images" className="text-l font-semibold text-gray-700">
        Fotos:
      </label>
      <div
        className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-black px-6 py-10"
        onDrop={handleImageDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          <div className="mt-4 flex text-m leading-6 text-gray-600">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold green_text"
            >
              <span> Fotos hochladen</span>
              <p className="text-xs leading-5 text-gray-700">
                oder ziehen und ablegen
              </p>
              <input
                id="image-upload"
                name="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                multiple
              />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.preview}
                  alt={`Uploaded preview ${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  onClick={(e) => handleRemoveImage(e, image)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

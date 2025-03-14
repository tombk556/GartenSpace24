import Link from "next/link";
import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { formatCurrency, SquareMeter } from "../Hooks";
import { FaSpinner } from "react-icons/fa"; // Import Spinner Icon

export default function PropertyDisplay({ property }) {
  const id = property.id;
  const fileId = Object.values(property.images)[0];

  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  const fetchImage = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entities/download/${id}/${fileId}`
      );
      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);
      } else {
        console.error("Failed to fetch image:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div
      className="w-[700px] h-[300px] flex flex-wrap justify-center items-start p-4 border-2 border-gray-400 rounded-lg"
      key={property.id}
    >
      <div className="relative w-full md:w-1/2 h-64 flex items-center justify-center">
        {isLoadingImages ? (
          <FaSpinner className="animate-spin text-gray-700 text-4xl" />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="Property Image"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        ) : (
          <p>No image available</p>
        )}
      </div>

      <div className="w-full md:w-1/2 md:pl-4">
        <Link href={`/displayvenues/${property.id}`}>
          <div className="text-l text-gray-700 p-4 mb-4 font-bold">
            <p>{property.meta.description}</p>
          </div>
          <div className="text-s text-gray-700 p-4 mb-4 font-thin inline-flex items-center">
            <FaLocationDot className="mr-2" />
            <p>
              {property.address.city} - {property.address.plz}
            </p>
          </div>

          <div className="flex justify-around space-x-4">
            <div>
              <p className="text-l font-bold">
                {formatCurrency(property.meta.price)}
              </p>
              <p className="text-xs">{property.meta.offer}</p>
            </div>
            <div>
              <p className="text-l font-bold">
                {SquareMeter(property.meta.size)}
              </p>
              <p className="text-xs">Grundstücksfläche</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

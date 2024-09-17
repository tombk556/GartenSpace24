import Link from "next/link";
import { truncateText } from "../Hooks";
import { FaLocationDot, FaHouseChimney } from "react-icons/fa6";
import {
  formatCurrency,
  calculatePricePerSquareMeter,
  SquareMeter,
} from "../Hooks";

export default function PropertyDisplay({ property }) {
  return (
    <div className="flex flex-wrap justify-center items-start p-4 border-2 border-gray-300 rounded-lg">
      <div className="w-full md:w-2/3 h-64 bg-gray-300 animate-pulse rounded-lg shadow-lg justify-center"></div>

      <div className="w-full md:w-1/3 md:pl-4">
        <Link href={`/venues/${property._id}`}>
          <div className="text-xl text-gray-700 p-4 mb-4 font-bold">
            <p>{truncateText(property.meta.description, 50)}</p>
          </div>
          <div className="text-l text-gray-700 p-4 mb-4 font-semibold flex">
            <FaLocationDot className="mr-2" /> 
            <p>
              {property.address.city}
            </p>
          </div>
          <div className="bg-blue-800 text-white p-4 mb-4">
            <p>Price Information</p>
          </div>
        </Link>
      </div>

      <div className="w-full h-10 bg-blue-800 text-white flex items-center justify-center mt-4"></div>
    </div>
  );
}

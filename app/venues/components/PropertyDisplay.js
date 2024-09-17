import Link from "next/link";
import { truncateText } from "../Hooks";
import { FaLocationDot } from "react-icons/fa6";
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
          <div className="text-l text-gray-700 p-4 mb-4 font-bold">
            <p>{truncateText(property.meta.description, 50)}</p>
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
              <p className="text-xs">Kaufpreis</p>
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

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from "@app/displayvenues/Hooks";
import { SquareMeter } from "@app/displayvenues/Hooks";

function AdvertTable({ adverts, onDelete }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 border">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Angebot
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Stadt
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            PLZ
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Beschreibung
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Aktionen
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {adverts.map(advert => (
          <tr key={advert.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 hover:underline">
              <Link href={`/displayadverts/${advert.id}`}>
                {advert.id}
              </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {advert.offer}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {advert.city}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {advert.plz}
            </td>
            <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
              {advert.description}
            </td>
            <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
              <button
                onClick={() => onDelete(advert.id)}
                className="text-red-700 hover:text-red-800 font-medium"
              >
                Löschen
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdvertTable;

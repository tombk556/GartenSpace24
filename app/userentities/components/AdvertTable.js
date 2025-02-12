import React from 'react';
import Link from 'next/link';
import { formatCurrency } from "@app/displayvenues/Hooks";
import { SquareMeter } from "@app/displayvenues/Hooks";

function AdvertTable({ entities, onDelete }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 border">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Typ
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Größe
          </th>
          <th className="px-6 py-3 text-left text-m font-medium text-gray-800 tracking-wider">
            Preis
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
        {entities.map(entity => (
          <tr key={entity.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 hover:underline">
              <Link href={`/displayvenues/${entity.id}`}>
                {entity.id}
              </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {entity.meta.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {SquareMeter(entity.meta.size)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {formatCurrency(entity.meta.price)}
            </td>
            <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
              {entity.meta.description}
            </td>
            <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
              <button
                onClick={() => onDelete(entity.id)}
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

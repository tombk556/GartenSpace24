"use client";

import React, { useState, useEffect } from "react";

const Page = () => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entities/get_user_entities`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(response => response.json())
        .then(data => setEntities(data))
        .catch(error => console.error("Error fetching data:", error));
    } else {
      console.error("No access token found");
    }
  }, []);

  return (
    <div className="p-4">
      <p className="text-xl font-bold mb-4">Hallo</p>
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entities.map(entity => (
            <tr key={entity._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {entity._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {entity.meta.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {entity.meta.size}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {entity.meta.price}
              </td>
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                {entity.meta.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;

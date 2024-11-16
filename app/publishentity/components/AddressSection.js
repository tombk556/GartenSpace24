import React from 'react';

export default function AddressSection({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <label
            htmlFor="street"
            className="text-l font-semibold text-gray-700"
          >
            Adresse:
          </label>
          <p className="text-xs text-gray-700">
            Die gesamte Adresse wird erst bei einer Kontaktanfrage
            veröffentlicht
          </p>
          <div className="mt-2">
            <input
              type="text"
              name="street"
              id="street"
              placeholder="Musterstraße 123"
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.streetAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="sm:col-span-2 sm:col-start-1">
          <label
            htmlFor="city"
            className="text-l font-semibold text-gray-700"
          >
            Stadt:
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="city"
              id="city"
              placeholder="Musterstadt"
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="country"
            className="text-l font-semibold text-gray-700"
          >
            Bundesland:
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="country"
              id="country"
              autoComplete="address-level1"
              placeholder="Baden-Württemberg"
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.region}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="plz"
            className="text-l font-semibold text-gray-700"
          >
            PLZ:
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="plz"
              id="plz"
              autoComplete="postal-code"
              placeholder="12345"
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

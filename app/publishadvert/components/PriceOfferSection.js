import React from 'react';

export default function PriceOfferSection({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="type"
            className="text-l font-semibold text-gray-700"
          >
            Angebot:
          </label>
          <div className="mt-2">
            <select
              id="offer"
              name="offer"
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.offer}
              onChange={handleChange}
            >
              <option value="Pachten">Pachten</option>
              <option value="Kaufen">Kaufen</option>
              <option value="Mieten">Mieten</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

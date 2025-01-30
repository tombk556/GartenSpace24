import React from "react";

export default function AddressSection({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2 sm:col-start-1">
          <label htmlFor="city" className="text-l font-semibold text-gray-700">
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
            <select
              id="offer"
              name="offer"
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.offer}
              onChange={handleChange}
            >
              <option value="Baden-Württemberg">Baden-Württemberg</option>
              <option value="Bayern">Bayern</option>
              <option value="Berlin">Berlin</option>
              <option value="Brandenburg">Brandenburg</option>
              <option value="Bremen">Bremen</option>
              <option value="Hamburg">Hamburg</option>
              <option value="Hessen">Hessen</option>
              <option value="Mecklenburg-Vorpommern">
                Mecklenburg-Vorpommern
              </option>
              <option value="Niedersachsen">Niedersachsen</option>
              <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
              <option value="Rheinland-Pfalz">Rheinland-Pfalz"</option>
              <option value="Saarland">Saarland</option>
              <option value="Sachsen">Sachsen</option>
              <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
              <option value="Schleswig-Holstein">Schleswig-Holstein</option>
              <option value="Thüringen">Thüringen</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="plz" className="text-l font-semibold text-gray-700">
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

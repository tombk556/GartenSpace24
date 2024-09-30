import React from 'react';

import { FaCamera } from "react-icons/fa";

export default function EntityForm() {
  return (
    <form>
      <div className="space-y-12">
        {/* Beschreibung und Fotos */}
        <div className="border-b border-gray-900/10 pb-12">
        <h1 className="orange_text text-2xl font-bold">Neues Inserat erstellen und veröffentlichen</h1>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="shortDesc" className="text-l font-semibold text-gray-700">
                Kurz Beschreibung:
              </label>
              <div className="mt-1">
                <div>
                  <input
                    type="text"
                    name="shortDesc"
                    id="shortDesc"
                    autoComplete="username"
                    className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                    placeholder="Wunderschöner Kleingarten ..."
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                Beschreibung:
              </label>
              <div className="mt-2">
                <textarea
                  id="longDesc"
                  name="longDesc"
                  placeholder="Dieser Kleingarten ist perfekt für Familie, die einen städtischen Ausgleich in der Natur suche ..."
                  rows={3}
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                ></textarea>
              </div>
            </div>
            <div className="col-span-full">
              <label htmlFor="images" className="text-l font-semibold text-gray-700">
                Fotos:
              </label>
              <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-black px-6 py-10">
                <div className="text-center">
                <FaCamera size={40}/>
                  <div className="mt-4 flex text-m leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold orange_text"
                    >
                      <span>Fotos hochladen</span>
                      <input id="image-upload" name="image-upload" type="file" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-700">oder ziehen und ablegen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Adresse */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                Adresse:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"

                />
              </div>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                Stadt:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                Bundesland:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                  />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                PLZ:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                Preis:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="longDesc" className="text-l font-semibold text-gray-700">
                Angebot:
              </label>
              <div className="mt-2">
                <select
                  id="offer"
                  name="offer"
                  autoComplete="country-name"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                >
                  <option>Vermieten (Tage)</option>
                  <option>Kaufen</option>
                  <option>Verpachten</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

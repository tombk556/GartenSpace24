"use client";

import React from "react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import ErrorMessage from "@components/ErrorMessage";

export default function EntityForm() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...imagePreviews]);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...imagePreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = (e, image) => {
    e.preventDefault();
    setSelectedImages(selectedImages.filter((img) => img !== image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("You must accept the Terms & Conditions to create an account.");
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {/* Beschreibung und Fotos */}
        <div className="border-b border-gray-900/10 pb-12">
          <h1 className="orange_text text-2xl font-bold">
            Neues Inserat erstellen und veröffentlichen
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="shortDesc"
                className="text-l font-semibold text-gray-700"
              >
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
              <label
                htmlFor="longDesc"
                className="text-l font-semibold text-gray-700"
              >
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
              <label
                htmlFor="images"
                className="text-l font-semibold text-gray-700"
              >
                Fotos:
              </label>
              <div
                className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-black px-6 py-10"
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-center">
                  <div className="mt-4 flex text-m leading-6 text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold orange_text"
                    >
                      <span> Fotos hochladen</span>
                      <p className="text-xs leading-5 text-gray-700">
                        oder ziehen und ablegen
                      </p>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        multiple
                      />
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Uploaded preview ${index}`}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <button
                          onClick={(e) => handleRemoveImage(e, image)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Adresse */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="longDesc"
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
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  placeholder="Musterstraße 123"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="longDesc"
                className="text-l font-semibold text-gray-700"
              >
                Stadt:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  placeholder="Musterstadt"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="longDesc"
                className="text-l font-semibold text-gray-700"
              >
                Bundesland:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  placeholder="Baden-Württemberg"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="longDesc"
                className="text-l font-semibold text-gray-700"
              >
                PLZ:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  placeholder="12345"
                  className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="longDesc"
                className="text-l font-semibold text-gray-700"
              >
                Preis (€):
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
              <label
                htmlFor="longDesc"
                className="text-l font-semibold text-gray-700"
              >
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
      <div className="mt-6">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label
            htmlFor="remember-me"
            className="ml-3 block text-sm text-gray-800"
          >
            Ich akzeptiere die{" "}
            <Link href="#" className="font-semibold orange_text">
              Nutzungsbedingung
            </Link>
          </label>
        </div>
        <ErrorMessage message={error} />
        <button
          type="submit"
          className="mt-4 black_btn text-white text-sm font-semibold py-3.5 rounded-md"
        >
          Veröffentlichen und speichern
        </button>
      </div>
    </form>
  );
}

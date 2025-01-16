import React from 'react';

export default function DescriptionSection({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h1 className="orange_text text-2xl font-bold">
        Neue Anzeige erstellen und veröffentlichen
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <label
            htmlFor="description"
            className="text-l font-semibold text-gray-700"
          >
            Beschreibung:
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              placeholder="Ich suche einen Kleingarten in meiner Stadt, um dem Jungel der Stadt zu entfliehen..."
              rows={3}
              className="w-full text-gray-800 px-4 py-1.5 rounded-md border-2 border-gray-800 focus:outline-none"
              value={formData.longDesc}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function PropertiesSection({ checkboxItems, selectedProperties, setSelectedProperties }) {
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedProperties([...selectedProperties, value]);
    } else {
      setSelectedProperties(selectedProperties.filter((item) => item !== value));
    }
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <label
        htmlFor="properties"
        className="text-l font-semibold text-gray-700"
      >
        Eigenschaften:
      </label>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {checkboxItems.map((item, index) => (
          <div className="flex items-center mb-4" key={index}>
            <input
              id={`checkbox-${index}`}
              type="checkbox"
              value={item}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={`checkbox-${index}`}
              className="ms-2 text-sm font-medium text-gray-700"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

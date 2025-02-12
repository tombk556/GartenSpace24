import React from 'react';

export default function ConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="text-gray-700">Weiterleiten zu ihrem Objekt...</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Nein
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Ja
          </button>
        </div>
      </div>
    </div>
  );
}

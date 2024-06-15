import React from 'react';

const ConfirmationModal = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Potwierdź usunięcie</h2>
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4">
            Usuń
          </button>
          <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

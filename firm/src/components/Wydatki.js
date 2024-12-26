import React, { useState, useEffect } from 'react';
import axios from 'axios';
import koszIcon from "../icons/kosz.png";

const Wydatki = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [newExpense, setNewExpense] = useState({
    date: '',
    value: '',
    description: ''
  });

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }
    try {
      const response = await axios.get('https://localhost:7039/api/Expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania wydatków:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (!newExpense.date || !newExpense.value || !newExpense.description) {
      setError('Proszę uzupełnić wszystkie pola.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('https://localhost:7039/api/Expenses', newExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addedExpense = response.data;
      setExpenses([...expenses, addedExpense]);
      setNewExpense({ date: '', value: '', description: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Błąd podczas dodawania wydatku:', error);
      setError('Wystąpił błąd podczas dodawania wydatku.');
    }
  };

  const handleDeleteExpense = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:7039/api/Expenses/${deleteExpenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistically update the local state by filtering out the deleted expense
      setExpenses(expenses.filter(expense => expense.id !== deleteExpenseId));
      setDeleteExpenseId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Błąd podczas usuwania wydatku:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };

  const openDeleteConfirmation = (expenseId) => {
    setDeleteExpenseId(expenseId);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', options).replace(",", "");
  };

  return (
    <div className="p-10 ml-11">
      <div className="mt-5">
        <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6">
          <div className="text-white text-4xl font-semibold">Wydatki</div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-800 transition"
          >
            <span>Dodaj wydatek</span>
          </button>
        </div>

        <table className="w-full rounded-lg shadow-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Wartość</th>
              <th className="p-3 text-left">Opis</th>
              <th className="p-3 text-center"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">{expense.id}</td>
                <td className="p-3">{formatDate(expense.date)}</td>
                <td className="p-3">{expense.value} zł</td>
                <td className="p-3">{expense.description}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openDeleteConfirmation(expense.id)}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
                  >
                    <img src={koszIcon} alt="Usuń" className="inline w-5 mr-2" />
                    <span>Usuń</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 opacity-50"></div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
                  <h3 className="text-lg font-medium">Dodaj nowy wydatek</h3>
                </div>
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700">Data</label>
                      <input
                        type="datetime-local"
                        id="expenseDate"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="mt-1 py-2 px-3 block w-full shadow-md sm:text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="expenseValue" className="block text-sm font-medium text-gray-700">Wartość</label>
                      <input
                        type="number"
                        id="expenseValue"
                        value={newExpense.value}
                        onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })}
                        className="mt-1 py-2 px-3 block w-full shadow-md sm:text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="expenseDescription" className="block text-sm font-medium text-gray-700">Opis</label>
                      <textarea
                        id="expenseDescription"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="mt-1 py-2 px-3 block w-full shadow-md sm:text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleAddExpense}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md shadow-lg px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-base font-medium text-white hover:bg-green-500 sm:text-sm sm:leading-5"
                  >
                    Dodaj
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="mt-3 sm:mt-0 sm:ml-3 w-full inline-flex justify-center rounded-md shadow-md px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 border-gray-300"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Czy na pewno chcesz usunąć ten wydatek?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => { handleDeleteExpense(); setShowDeleteModal(false); }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Tak
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Błąd</h2>
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wydatki;

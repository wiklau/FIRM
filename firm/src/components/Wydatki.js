import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactComponent as KoszIcon } from '../icons/delete.svg';
import DatePicker from './DatePicker';

const Wydatki = () => {
  const [expenses, setExpenses] = useState([]);
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
      const response = await axios.get('https://firmtracker-server.onrender.com/api/Expenses', {
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

    if (newExpense.value <= 0) {
      setError('Wartość wydatku musi być liczbą dodatnią.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('https://firmtracker-server.onrender.com/api/Expenses', newExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addedExpense = response.data;
      setExpenses([...expenses, addedExpense]);
      setNewExpense({ date: '', value: '', description: '' });
    } catch (error) {
      console.error('Błąd podczas dodawania wydatku:', error);
      setError('Wystąpił błąd podczas dodawania wydatku.');
    }
  };

  const handleDeleteExpense = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://firmtracker-server.onrender.com/api/Expenses/${deleteExpenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  const handleDateChange = (e) => {
    setNewExpense({ ...newExpense, date: e.target.value });
  };

  const handleValueChange = (e) => {
    setNewExpense({ ...newExpense, value: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setNewExpense({ ...newExpense, description: e.target.value });
  };

  return (
    <div className="p-10 ml-11">
      <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6">
        <h1 className="text-white text-4xl font-semibold">Wydatki</h1>
      </div>

      <div className="bg-white shadow-lg p-8 rounded-xl max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col space-y-6">
            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700">Data</label>
                <DatePicker
                  type="datetime-local"
                  id="expenseDate"
                  value={newExpense.date}
                  onChange={handleDateChange}
                  className="mt-1 py-2 px-3 block w-full shadow-md sm:text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  maxDate="2099-12-31T23:59"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="expenseValue" className="block text-sm font-medium text-gray-700">Wartość</label>
                <input
                  type="number"
                  id="expenseValue"
                  value={newExpense.value}
                  onChange={handleValueChange}
                  className="mt-1 py-2 px-3 block w-full shadow-md sm:text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expenseDescription" className="block text-sm font-medium text-gray-700">Opis</label>
              <textarea
                id="expenseDescription"
                value={newExpense.description}
                onChange={handleDescriptionChange}
                className="mt-1 py-2 px-3 block w-full shadow-md sm:text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
              />
            </div>

            <button
              onClick={handleAddExpense}
              type="button"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out w-full"
            >
              Dodaj
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
      </div>

      <div className="mt-5">
        <table className="w-full rounded-lg shadow-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Wartość</th>
              <th className="p-3 text-left">Opis</th>
              <th className="p-3 text-center">Usuń</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {expenses.map(expense => (
              <tr key={expense.id} className="group hover:bg-gray-100 transition-colors">
                <td className="p-3">{expense.id}</td>
                <td className="p-3">{formatDate(expense.date)}</td>
                <td className="p-3">{expense.value} zł</td>
                <td className="p-3">{expense.description}</td>
                <td className="p-3 flex justify-center space-x-2">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => openDeleteConfirmation(expense.id)}
                      className="text-red-500 hover:bg-red-200 active:bg-red-300 focus:outline-none p-2 rounded-full transition-colors"
                    >
                      <KoszIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Czy na pewno chcesz usunąć ten wydatek?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => { handleDeleteExpense(); setShowDeleteModal(false); window.scrollTo({ top: 0 })  }}
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
    </div>
  );
};

export default Wydatki;

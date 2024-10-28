import React, { useState, useEffect } from 'react';
import axios from 'axios';
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";
import ConfirmationModal from './ConfirmationModal';

const Wydatki = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
        headers: {
          Authorization: `Bearer ${token}`
        }
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const addedExpense = response.data;
      setExpenses([...expenses, addedExpense]);
      setNewExpense({
        date: '',
        value: '',
        description: ''
      });
      setShowModal(false);
    } catch (error) {
      console.error('Błąd podczas dodawania wydatku:', error);
      setError('Wystąpił błąd podczas dodawania wydatku.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:7039/api/Expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchExpenses();
      setDeleteExpenseId(null);
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
  };

  const closeDeleteConfirmation = () => {
    setDeleteExpenseId(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', options).replace(",", "");
  };

  return (
    <div className="p-10 ml-11">
      <div className="mt-5">
        <div className='flex items-center justify-between'>
          <div className='h-20 text-5xl ml-1'>
            Wydatki
          </div>
          <button onClick={() => setShowModal(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex">
            <img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 top-0 z-10">
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Data</th>
              <th className="border border-gray-300 p-2">Wartość</th>
              <th className="border border-gray-300 p-2">Opis</th>
              <th className="border border-gray-300 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td className="border border-gray-300 p-2">{expense.id}</td>
                <td className="border border-gray-300 p-2">{formatDate(expense.date)}</td>
                <td className="border border-gray-300 p-2">{expense.value}</td>
                <td className="border border-gray-300 p-2">{expense.description}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => openDeleteConfirmation(expense.id)} className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex">
                    <img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń
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
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Dodaj nowy wydatek</h3>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700">Data</label>
                    <input type="datetime-local" id="expenseDate" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="mt-1 border py-1 px-3 block w-full shadow-sm sm:text-sm rounded-md" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="expenseValue" className="block text-sm font-medium text-gray-700">Wartość</label>
                    <input type="number" id="expenseValue" value={newExpense.value} onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })} className="mt-1 border py-1 px-3 block w-full shadow-sm sm:text-sm rounded-md" />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="expenseDescription" className="block text-sm font-medium text-gray-700">Opis</label>
                    <textarea id="expenseDescription" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} 
                    className="mt-1 border py-2 px-3 block w-full shadow-sm sm:text-sm rounded-md" rows="4"/>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={() => { handleAddExpense(); }} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                  Dodaj
                </button>
                <button onClick={() => setShowModal(false)} type="button" className="mt-3 sm:mt-0 mr-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Błąd</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Zamknij
            </button>
          </div>
        </div>
      )}
      {deleteExpenseId && (
        <ConfirmationModal
          message="Czy na pewno chcesz usunąć ten raport?"
          onCancel={closeDeleteConfirmation}
          onConfirm={() => { handleDeleteExpense(deleteExpenseId); }}
        />
      )}
    </div>
  );
};

export default Wydatki;

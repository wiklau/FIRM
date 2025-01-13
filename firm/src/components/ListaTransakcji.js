import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ReactComponent as EditIcon} from '../icons/edit.svg';
import {ReactComponent as KoszIcon} from '../icons/delete.svg';
import { useNavigate } from 'react-router-dom';


const ListaTransakcji = ({ onAdd}) => {
  const [transactions, setTransactions] = useState([]);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }
    try {
      const response = await axios.get('https://firmtracker-server.onrender.com/api/Transaction', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      alert('Błąd podczas pobierania transakcji');
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }
    try {
      const response = await axios.get('https://firmtracker-server.onrender.com/api/Products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.data.map(product => ({ value: product.id, label: product.name }));
    } catch (error) {
      alert('Błąd podczas pobierania produktów');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(`https://firmtracker-server.onrender.com/api/transaction/${deleteTransactionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(transactions.filter(transaction => transaction.id !== deleteTransactionId));
      setShowModal(false);
      setDeleteTransactionId(null);
    } catch (error) {
      setShowModal(false);
      setDeleteError(error.response?.data || 'Nieznany błąd');}
  };

  const openDeleteConfirmation = (transactionId) => {
    setDeleteTransactionId(transactionId);
    setShowModal(true);
  };

  const handleEditTransaction = (transactionId) => {
    navigate(`/transakcje/edytuj/${transactionId}`);
  };


  return (
    <div>
      <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6">
        <h1 className="text-white text-4xl font-semibold">Lista transakcji</h1>
        <button onClick={onAdd} className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-800 transition">
          Dodaj transakcję
        </button>
      </div>
      <div className="w-8/10 mx-auto mt-2">
        <div className="h-screen overflow-y-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Produkty</th>
                <th className="p-3 text-left">Kwota</th>
                <th className="p-3 text-left">Metoda płatności</th>
                <th className="p-3 text-center">Nr pracownika</th>
                <th className="p-3 text-center">Akcje</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="group hover:bg-gray-100 transition-colors">
                  <td className="p-3">{transaction.id}</td>
                  <td className="p-3">{formatDate(transaction.date)}</td>
                  <td className="p-3 truncate max-w-xs" title={transaction.transactionProducts.map(product => product.product.name).join(', ')}>
              {transaction.transactionProducts.map(product => product.product.name).join(', ')}
            </td>
                  <td className="p-3">{formatPrice(transaction.totalPrice)}</td>
                  <td className="p-3">{transaction.paymentType}</td>
                  <td className="p-3 text-center">{transaction.employeeId}</td>
                  <td className="p-3 flex justify-center space-x-2">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditTransaction(transaction.id)}
                      className="text-blue-500 hover:bg-blue-200 active:bg-blue-300 focus:outline-none p-2 rounded-full transition-colors"
                    >
                      <EditIcon className = "w-5 h-5"/>
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(transaction.id)}
                      className="text-red-500 hover:bg-red-200 active:bg-red-300 focus:outline-none p-2 rounded-full transition-colors"
                    >
                      <KoszIcon className = "w-5 h-5"/>
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Czy na pewno chcesz usunąć tę transakcję?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  handleDeleteTransaction();
                  setShowModal(false);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Tak
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteError && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Usuwanie transakcji nie powiodło się.</h2>
            <p className="text-red-500">{deleteError}</p>
            <button
              onClick={() => setDeleteError(null)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Wróć
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaTransakcji;

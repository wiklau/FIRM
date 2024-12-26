import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from '../icons/edit.png';
import koszIcon from '../icons/kosz.png';
import { useNavigate } from 'react-router-dom';

const ListaTransakcji = ({ onAdd}) => {
  const [transactions, setTransactions] = useState([]);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }
    try {
      const response = await axios.get('https://localhost:7039/api/Transaction', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania transakcji:', error);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }
    try {
      const response = await axios.get('https://localhost:7039/api/Products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.data.map(product => ({ value: product.id, label: product.name }));
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
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
      await axios.delete(`https://localhost:7039/api/transaction/${deleteTransactionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(transactions.filter(transaction => transaction.id !== deleteTransactionId));
      setShowModal(false);
      setDeleteTransactionId(null);
    } catch (error) {
      console.error('Błąd podczas usuwania transakcji:', error);
    }
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
        <h1 className="text-white text-4xl font-semibold">Lista Transakcji</h1>
        <button onClick={onAdd} className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-800 transition">
          Dodaj Transakcję
        </button>
      </div>
      <div className="w-8/10 mx-auto mt-2">
        <div className="h-screen overflow-y-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Produkt</th>
                <th className="p-3 text-left">Ilość</th>
                <th className="p-3 text-left">Kwota</th>
                <th className="p-3 text-left">Sposób płatności</th>
                <th className="p-3 text-center">Nr. Pracownika</th>
                <th className="p-3 text-center">Akcje</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3">{transaction.id}</td>
                  <td className="p-3">{formatDate(transaction.date)}</td>
                  <td className="p-3">
                    {transaction.transactionProducts.map(product => (
                      <div key={product.id}>{product.product.name}</div>
                    ))}
                  </td>
                  <td className="p-3">
                    {transaction.transactionProducts.map(product => (
                      <div key={product.id}>{product.quantity}</div>
                    ))}
                  </td>
                  <td className="p-3">{formatPrice(transaction.totalPrice)}</td>
                  <td className="p-3">{transaction.paymentType}</td>
                  <td className="p-3 text-center">{transaction.employeeId}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditTransaction(transaction.id)}
                      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition"
                    >
                      <img src={editIcon} alt="Edytuj" className="inline w-5 mr-2" />
                      Edytuj
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(transaction.id)}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
                    >
                      <img src={koszIcon} alt="Usuń" className="inline w-5 mr-2" />
                      Usuń
                    </button>
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
                onClick={handleDeleteTransaction}
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
    </div>
  );
};

export default ListaTransakcji;

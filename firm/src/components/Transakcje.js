import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import editIcon from "../icons/edit.png";
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";
import ConfirmationModal from './ConfirmationModal';

const Transakcje = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    id: 2,
    date: "",
    employeeId: "",
    transactionProducts: [
      {
        id: 0,
        transactionId: 2,
        productID: 0,
        productName: "",
        quantity: ""
      }
    ],
    paymentType: "",
    discount: "",
    description: "",
    totalPrice: 0
  });

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Transaction');
      setTransactions(response.data);
    } catch (error) {
      console.error('Błąd podczas dodawania transakcji:', error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Products');
      setProducts(response.data.map(product => ({ value: product.id, label: product.name })));
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
    console.log();
  }, []);

  const handleAddTransaction = async () => {
    if (!newTransaction.date || !newTransaction.employeeId || newTransaction.transactionProducts.some(product => !product.productName || !product.quantity)) {
      setError('Proszę uzupełnić wszystkie pola.');
      return;
    }
    try {
      console.log('Nowa transakcja:', newTransaction);
      await axios.post('https://localhost:7039/api/Transaction', newTransaction);

      fetchTransactions();
      setIsModalOpen(false);
      setNewTransaction({
        id: 2,
        date: "",
        employeeId: "",
        transactionProducts: [
          {
            id: 2,
            transactionId: 0,
            productID: 0,
            productName: "",
            quantity: ""
          }
        ],
        paymentType: "",
        discount: "",
        description: "",
        totalPrice: 0
      });
    } catch (error) {
      console.error('Błąd podczas dodawania transakcji:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', options).replace(",", "");
  };
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const handleAddProduct = () => {
    setNewTransaction({
      ...newTransaction,
      transactionProducts: [
        ...newTransaction.transactionProducts,
        {
          id: 2,
          transactionId: 0,
          productID: 0,
          productName: "",
          quantity: ""
        }
      ]
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedTransactionProducts = [...newTransaction.transactionProducts];
    updatedTransactionProducts.splice(index, 1);
    setNewTransaction({
      ...newTransaction,
      transactionProducts: updatedTransactionProducts
    });
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`https://localhost:7039/api/Transaction/${transactionId}`);
      fetchTransactions();
      setDeleteTransactionId(null);
    } catch (error) {
      console.error('Błąd podczas usuwania transakcji:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };
  const handleEditTransaction = async (transaction) => {
    try {
      if (!editTransaction) {
        setEditTransaction(transaction);
        setIsEditModalOpen(true);
        return;
      }
      if (!editTransaction.date || !editTransaction.employeeId || editTransaction.transactionProducts.some(product => !product.productName || !product.quantity) || !editTransaction.paymentType){
        setError('Proszę uzupełnić wszystkie pola.');
        return;}
      await axios.put(`https://localhost:7039/api/Transaction/${editTransaction.id}`, editTransaction);
      fetchTransactions();
      setIsEditModalOpen(false); 
      setEditTransaction(null);
      setError(null);
  
    } catch (error) {
      console.error('Błąd podczas edycji transakcji:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };
  const handleProductChange = (index, selectedOption) => {
    const updatedTransactionProducts = [...newTransaction.transactionProducts];
    updatedTransactionProducts[index].productID = selectedOption.value;
    updatedTransactionProducts[index].productName = selectedOption.label;
    setNewTransaction({
      ...newTransaction,
      transactionProducts: updatedTransactionProducts
    });
  };
  const handleEditProductChange = (index, selectedOption) => {
    const updatedTransactionProducts = [...editTransaction.transactionProducts];
    updatedTransactionProducts[index].productID = selectedOption.value;
    updatedTransactionProducts[index].productName = selectedOption.label;
    setEditTransaction({
      ...editTransaction,
      transactionProducts: updatedTransactionProducts
    });
  };
  const openDeleteConfirmation = (transactionId) => {
    setDeleteTransactionId(transactionId);
  };
  
  const closeDeleteConfirmation = () => {
    setDeleteTransactionId(null);
  };  
  

  return (
    <div className='p-10 ml-11'>
      <div className='flex items-center justify-between'>
        <div className='h-20 text-5xl ml-1'>
          Lista Transakcji
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex">
          <img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj
        </button>
      </div>
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
      {isEditModalOpen && editTransaction && (
      <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edytuj transakcję</h2>
      <input
        type="datetime-local"
        name="date"
        value={editTransaction.date}
        onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
        placeholder="Data"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />
      Numer Pracownika
      <input
        type="number"
        name="employeeId"
        value={editTransaction.employeeId}
        onChange={(e) => setEditTransaction({ ...editTransaction, employeeId: e.target.value })}
        placeholder="Nr. Pracownika"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />
      {editTransaction.transactionProducts.map((product, index) => (
        <div key={index}>
          <Select
          name={`productName-${index}`}
          value={products.find(option => option.value === product.productName)}
          onChange={(selectedOption) => handleEditProductChange(index, selectedOption)}
          options={products}
          className="block w-full mb-4"
          placeholder="Wybierz produkt..."
          />
          Ilość
          <input
            type="number"
            name={`quantity-${index}`}
            value={product.quantity}
            onChange={(e) => {
              const newTransactionProducts = [...editTransaction.transactionProducts];
              newTransactionProducts[index].quantity = e.target.value;
              setEditTransaction({ ...editTransaction, transactionProducts: newTransactionProducts });
            }}
            placeholder="Ilość"
            className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      ))}
      <input
        type="text"
        name="paymentType"
        value={editTransaction.paymentType}
        onChange={(e) => setEditTransaction({ ...editTransaction, paymentType: e.target.value })}
        placeholder="Sposób płatności"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />
      Zniżka
      <input
        type="number"
        name="discount"
        value={editTransaction.discount}
        onChange={(e) => setEditTransaction({ ...editTransaction, discount: e.target.value })}
        placeholder="Rabat"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        name="description"
        value={editTransaction.description}
        onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
        placeholder="Opis"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />
      <button
        onClick={() => {
          handleEditTransaction();
          setIsEditModalOpen(false);
        }}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Zapisz zmiany
      </button>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Anuluj
      </button>
        </div>
      </div>
    )}

      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Dodaj nową transakcję</h2>
            <input
              type="datetime-local"
              name="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              placeholder="Data"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="employeeId"
              value={newTransaction.employeeId}
              onChange={(e) => setNewTransaction({ ...newTransaction, employeeId: e.target.value })}
              placeholder="Nr. Pracownika"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            {newTransaction.transactionProducts.map((product, index) => (
              <div key={index}>
                  <Select
                  name={`productName-${index}`}
                  value={products.find(option => option.value === product.productName)}
                  onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                  options={products}
                  className="block w-full mb-4"
                  placeholder="Wybierz produkt..."
                  />
                <input
                  type="number"
                  name={`quantity-${index}`}
                  value={product.quantity}
                  onChange={(e) => {
                    const newTransactionProducts = [...newTransaction.transactionProducts];
                    newTransactionProducts[index].quantity = e.target.value;
                    setNewTransaction({ ...newTransaction, transactionProducts: newTransactionProducts });
                  }}
                  placeholder="Ilość"  className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button onClick={() => handleRemoveProduct(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded">
                    Usuń
                  </button>
                </div>
              ))}
              <button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-3 rounded">
                Dodaj
              </button>
              <input
                type="text"
                name="paymentType"
                value={newTransaction.paymentType}
                onChange={(e) => setNewTransaction({ ...newTransaction, paymentType: e.target.value })}
                placeholder="Sposób płatności"
                className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                name="discount"
                value={newTransaction.discount}
                onChange={(e) => setNewTransaction({ ...newTransaction, discount: e.target.value })}
                placeholder="Rabat"
                className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Opis"
                className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => {
                  handleAddTransaction();
                  setIsModalOpen(false);
                  
                }}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Dodaj transakcję
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-1 rounded"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
        <div className="w-8/10 mx-auto mt-2">
          <div className="h-screen overflow-y-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Data</th>
                  <th className="border border-gray-300 p-2">Produkt</th>
                  <th className="border border-gray-300 p-2">Ilość</th>
                  <th className="border border-gray-300 p-2">Kwota</th>
                  <th className="border border-gray-300 p-2">Sposób płatności</th>
                  <th className="border border-gray-300 p-2">Nr. Pracownika</th>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="border border-gray-300 p-2">{transaction.id}</td>
                    <td className="border border-gray-300 p-2">{formatDate(transaction.date)}</td>
                    <td className="border border-gray-300 p-2">
                      {transaction.transactionProducts.map(product => (
                        <div key={product.id}>{product.product.name}</div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {transaction.transactionProducts.map(product => (
                        <div key={product.id}>{product.quantity}</div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-2">{formatPrice(transaction.totalPrice)}</td>
                    <td className="border border-gray-300 p-2">{transaction.paymentType}</td>
                    <td className="border border-gray-300 p-2">{transaction.employeeId}</td>
                    <td className="border border-gray-300 p-2"><button  onClick={() =>{handleEditTransaction(transaction);
                      console.log(transaction);
                    }
                        }
                        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex">
                        <img src={editIcon} alt="" className="w-8 h-8 mr-2" />Edytuj
                        </button></td>
                    <td className="border border-gray-300 p-2"><button onClick={() => openDeleteConfirmation(transaction.id)}
                      className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex">
                      <img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń
                      </button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-start mt-4">
          </div>
        </div>
        {deleteTransactionId && (
        <ConfirmationModal
        message="Czy na pewno chcesz usunąć tę transakcję?"
        onCancel={closeDeleteConfirmation}
        onConfirm={() => {handleDeleteTransaction(deleteTransactionId); setDeleteTransactionId(false);}}
        />)}
      </div>
    );
  }
  
export default Transakcje
  
  
  
  
  
                 

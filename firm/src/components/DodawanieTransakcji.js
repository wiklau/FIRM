import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {ReactComponent as MinusIcon} from "../icons/minus-icon.svg"
import DatePicker from './DatePicker';

const DodawanieTransakcji = () => {
  const [error, setError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    id: 2,
    date: '',
    employeeId: 1,
    paymentType: '',
    discount: 0,
    description: '',
    transactionProducts: [
      {
        id: 2,
        transactionId: 0,
        productID: 0,
        productName: '',
        quantity: ''
      }
    ],
  });

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Brak tokena. Użytkownik musi być zalogowany.');
          return;
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        

        const response = await axios.get('https://firmtracker-server.onrender.com/api/Products', config);
        const productOptions = response.data.map(product => ({
          value: product.id,
          label: product.name,
        }));
        setProducts(productOptions);
      } catch (error) {
        setError('Wystąpił błąd podczas ładowania produktów.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };
  const handleCancel = () => {
    navigate('/transakcje');
  }

  const handleProductChange = (index, selectedOption) => {
    const updatedTransactionProducts = [...newTransaction.transactionProducts];
    updatedTransactionProducts[index].productID = selectedOption.value;
    updatedTransactionProducts[index].productName = selectedOption.label;
    setNewTransaction({
      ...newTransaction,
      transactionProducts: updatedTransactionProducts,
    });
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
          productName: '',
          quantity: ''
        }
      ]
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedTransactionProducts = [...newTransaction.transactionProducts];
    updatedTransactionProducts.splice(index, 1);
    setNewTransaction({
      ...newTransaction,
      transactionProducts: updatedTransactionProducts,
    });
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.date ||  newTransaction.transactionProducts.some(product => !product.productName || !product.quantity)) {
      setError('Proszę uzupełnić wszystkie pola.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokena. Użytkownik musi być zalogowany.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('https://firmtracker-server.onrender.com/api/Transaction', newTransaction, config);

      setNewTransaction({
        id: 0,
        date: '',
        employeeId: 1,
        transactionProducts: [
          {
            id: 0,
            transactionId: 0,
            productID: 0,
            productName: '',
            quantity: ''
          }
        ],
        paymentType: '',
        discount: '',
        description: '',
        totalPrice: 0,
      });
      navigate('/transakcje');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dodaj nową transakcję</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex items-center space-x-4">
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Data transakcji</label>
        <DatePicker
          value={newTransaction.date}
          onChange={handleInputChange}
          name="date"
          className="flex-1 mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxDate="2099-12-31T23:59"
        />
        </div> 
      </div>

      <label className="block mb-2 text-gray-700 font-medium">Produkty transakcji</label>
      <div className="border border-gray-300 rounded-lg shadow-sm p-4 h-80 overflow-y-scroll">
        {isLoading ? (
          <div className="text-center">Ładowanie produktów...</div>
        ) : (
          <>
            {newTransaction.transactionProducts.map((product, index) => (
              <div key={index} className="mb-4 flex items-center space-x-4">
                <Select
                  name={`productName-${index}`}
                  value={products.find(option => option.value === product.productID)}
                  onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                  options={products}
                  className="flex-1"
                  placeholder="Wybierz produkt..."
                />
                <input
                  type="number"
                  name={`quantity-${index}`}
                  value={product.quantity}
                  onChange={(e) => {
                    const updatedTransactionProducts = [...newTransaction.transactionProducts];
                    updatedTransactionProducts[index].quantity = e.target.value;
                    setNewTransaction({ ...newTransaction, transactionProducts: updatedTransactionProducts });
                  }}
                  placeholder="Ilość"
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveProduct(index)}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition focus:outline-none ${newTransaction.transactionProducts.length > 1
                      ? "text-gray-500 hover:text-red-600 hover:bg-red-100 active:bg-red-200"
                      : "text-gray-300 cursor-not-allowed"
                    }`}
                  disabled={newTransaction.transactionProducts.length <= 1}
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </>
        )}

        <button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition mb-3"
        >
          Dodaj produkt
        </button>
      </div>
      <div className="mt-6 flex justify-between">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Metoda płatności</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="BLIK"
                checked={newTransaction.paymentType === "BLIK"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">BLIK</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="Gotówka"
                checked={newTransaction.paymentType === "Gotówka"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Gotówka</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="Karta płatnicza"
                checked={newTransaction.paymentType === "Karta płatnicza"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Karta płatnicza</span>
            </label>
          </div>
        </div>
        <div className="">
          <label className="block mb-2 text-gray-700 font-medium">Rabat (%)</label>
        <input
          type="number"
          name="discount"
          value={newTransaction.discount}
          onChange={handleInputChange}
          placeholder="Rabat"
          min="0"
          max="100"
          className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        /></div>
        
      </div>
  <div>
  <label className="block mb-2 text-gray-700 font-medium">Opis</label>      
    <input
        type="text"
        name="description"
        value={newTransaction.description}
        onChange={handleInputChange}
        placeholder="Opis"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      </div>

  
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleAddTransaction}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition"
        >
          Dodaj transakcję
        </button>
  
        <button
          onClick={handleCancel}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
        >
          Anuluj
        </button>
      </div>
    </div>
  );  
};

export default DodawanieTransakcji;

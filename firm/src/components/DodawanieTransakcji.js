import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const DodawanieTransakcji = () => {
  const [error, setError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    id: 2,
    date: '',
    employeeId: '',
    paymentType: '',
    discount: '',
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

        const response = await axios.get('https://localhost:7039/api/Products', config);
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
    if (!newTransaction.date || !newTransaction.employeeId || newTransaction.transactionProducts.some(product => !product.productName || !product.quantity)) {
      setError('Proszę uzupełnić wszystkie pola.');
      return;
    }

    try {
      console.log('Nowa transakcja:', newTransaction);

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

      await axios.post('https://localhost:7039/api/Transaction', newTransaction, config);

      setNewTransaction({
        id: 0,
        date: '',
        employeeId: '',
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
      console.error('Błąd podczas dodawania transakcji:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Dodaj nową transakcję</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="datetime-local"
        name="date"
        value={newTransaction.date}
        onChange={handleInputChange}
        placeholder="Data"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <input
        type="number"
        name="employeeId"
        value={newTransaction.employeeId}
        onChange={handleInputChange}
        placeholder="Nr. Pracownika"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      {isLoading ? (
        <div className="text-center">Ładowanie produktów...</div>
      ) : (
        <>
          {newTransaction.transactionProducts.map((product, index) => (
            <div key={index} className="mb-4">
              <Select
                name={`productName-${index}`}
                value={products.find(option => option.value === product.productID)}
                onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                options={products}
                className="block w-full mb-2"
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
                className="block w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => handleRemoveProduct(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Usuń
              </button>
            </div>
          ))}
        </>
      )}
      
      <button
        onClick={handleAddProduct}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-3 rounded"
      >
        Dodaj produkt
      </button>

      <input
        type="text"
        name="paymentType"
        value={newTransaction.paymentType}
        onChange={handleInputChange}
        placeholder="Sposób płatności"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <input
        type="number"
        name="discount"
        value={newTransaction.discount}
        onChange={handleInputChange}
        placeholder="Rabat"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <input
        type="text"
        name="description"
        value={newTransaction.description}
        onChange={handleInputChange}
        placeholder="Opis"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <button
        onClick={handleAddTransaction}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-3 rounded"
      >
        Dodaj transakcję
      </button>
    </div>
  );
};

export default DodawanieTransakcji;

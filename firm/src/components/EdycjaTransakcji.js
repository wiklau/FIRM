import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

const EdycjaTransakcji = () => {
  const { id } = useParams(); 
  const [transaction, setTransaction] = useState({
    date: '',
    employeeId: '',
    paymentType: '',
    discount: '',
    description: '',
    transactionProducts: [{ productID: '', productName: '', quantity: '' }],
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Brak tokena. Użytkownik musi być zalogowany.');
    }
    return token;
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = getToken();
        if (!token) return;
  
        const transactionResponse = await axios.get(`https://localhost:7039/api/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Dane transakcji:', transactionResponse.data);
  
        const updatedTransaction = {
          ...transactionResponse.data,
          transactionProducts: transactionResponse.data.transactionProducts.map((transactionProduct) => ({
            productID: transactionProduct.product.id,
            productName: transactionProduct.product.name,
            quantity: transactionProduct.quantity,
          })),
        };
        setTransaction(updatedTransaction);
  
        const productResponse = await axios.get('https://localhost:7039/api/Products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Produkty:', productResponse.data);
  
        const productOptions = productResponse.data.map((product) => ({
          value: product.id,
          label: product.name,
        }));
        setProducts(productOptions);
      } catch (error) {
        console.error('Błąd podczas pobierania transakcji lub produktów:', error);
        setError('Wystąpił błąd podczas ładowania danych.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTransaction();
  }, [id]);
  
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleProductChange = (index, selectedOption) => {
    const updatedTransactionProducts = [...transaction.transactionProducts];
    updatedTransactionProducts[index].productID = selectedOption.value;
    updatedTransactionProducts[index].productName = selectedOption.label;
    setTransaction({
      ...transaction,
      transactionProducts: updatedTransactionProducts,
    });
  };
  

  const handleAddProduct = () => {
    setTransaction({
      ...transaction,
      transactionProducts: [
        ...transaction.transactionProducts,
        { productID: 0, productName: '', quantity: '' },
      ],
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedTransactionProducts = [...transaction.transactionProducts];
    updatedTransactionProducts.splice(index, 1);
    setTransaction({
      ...transaction,
      transactionProducts: updatedTransactionProducts,
    });
  };

  const handleSaveChanges = async () => {
    if (!transaction.date || !transaction.employeeId || transaction.transactionProducts.some(product => !product.productName || !product.quantity)) {
      setError('Proszę uzupełnić wszystkie pola.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError('Brak tokena. Użytkownik musi być zalogowany.');
        return;
      }

      const response = await axios.put(`https://localhost:7039/api/transaction/${id}`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Zaktualizowana transakcja:', response.data);
      navigate('/transakcje');
    } catch (error) {
      console.error('Błąd podczas zapisywania zmian:', error);
      setError('Wystąpił błąd podczas zapisywania zmian.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edycja Transakcji</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="datetime-local"
        name="date"
        value={transaction.date}
        onChange={handleInputChange}
        placeholder="Data"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <input
        type="number"
        name="employeeId"
        value={transaction.employeeId}
        onChange={handleInputChange}
        placeholder="Nr. Pracownika"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      {isLoading ? (
        <div className="text-center">Ładowanie produktów...</div>
      ) : (
        <>
          {transaction.transactionProducts.map((product, index) => (
            <div key={index} className="mb-4">
              <Select
                name={`productName-${index}`}
                value={products.find(option => option.value === product.productID) || null}
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
                  const updatedTransactionProducts = [...transaction.transactionProducts];
                  updatedTransactionProducts[index].quantity = e.target.value;
                  setTransaction({ ...transaction, transactionProducts: updatedTransactionProducts });
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
        value={transaction.paymentType}
        onChange={handleInputChange}
        placeholder="Sposób płatności"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <input
        type="number"
        name="discount"
        value={transaction.discount}
        onChange={handleInputChange}
        placeholder="Rabat"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <input
        type="text"
        name="description"
        value={transaction.description}
        onChange={handleInputChange}
        placeholder="Opis"
        className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />

      <button
        onClick={handleSaveChanges}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-3 rounded"
      >
        Zapisz zmiany
      </button>
    </div>
  );
};

export default EdycjaTransakcji;

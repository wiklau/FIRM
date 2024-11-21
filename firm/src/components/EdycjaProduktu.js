import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EdycjaProduktu = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    type: '1',
    availability: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Brak tokena. Użytkownik musi być zalogowany.');
          return;
        }

        const response = await axios.get(`https://localhost:7039/api/Products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania produktu:', error);
        setError('Wystąpił błąd podczas pobierania danych produktu.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSaveChanges = async () => {
    const { name, description, price, type, availability } = product;
  
    if (!name || !description || !price || type === '') {
      setError('Proszę uzupełnić wszystkie wymagane pola.');
      return;
    }
  
    const payload = {
      id,
      name,
      description,
      price,
      type: parseInt(type, 10),
      ...(type === '1' && { availability: availability || 0 }),
    };
  
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
  
      const response = await axios.put(`https://localhost:7039/api/Products/${id}`, payload, config);
  
      console.log('Produkt zapisany:', response.data);
  
      setError(null);
      navigate('/produkty');
    } catch (error) {
      console.error('Błąd podczas zapisywania zmian:', error);
  
      if (error.response && error.response.status === 400) {
        setError('ID produktu nie zgadza się.');
      } else {
        setError('Wystąpił błąd podczas zapisywania zmian. Spróbuj ponownie.');
      }
    }
  };
  

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edycja produktu</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          placeholder="Nazwa produktu lub usługi"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Opis"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          step="0.01"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          placeholder="Cena"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          name="type"
          value={product.type}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="1">Produkt</option>
          <option value="0">Usługa</option>
        </select>
        {product.type === '1' && (
          <input
            type="number"
            name="availability"
            value={product.availability}
            onChange={handleInputChange}
            placeholder="Dostępność (ilość)"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Zapisz zmiany
        </button>
      </div>
    </div>
  );
};

export default EdycjaProduktu;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const DodawanieProduktu = () => {
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    type: '1',
    availability: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    const { name, description, price, type, availability } = newProduct;

    if (!name || !description || !price || type === '') {
      setError('Proszę uzupełnić wszystkie wymagane pola.');
      return;
    }

    const payload = {
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

      await axios.post('https://localhost:7039/api/Products', payload, config);

      setNewProduct({
        name: '',
        description: '',
        price: '',
        type: '1',
        availability: '',
      });
      setError(null);
      navigate('/produkty');
    } catch (error) {
      console.error('Błąd podczas dodawania produktu:', error);
      setError('Wystąpił błąd podczas dodawania produktu. Spróbuj ponownie.');
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Dodaj nowy produkt lub usługę</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Nazwa produktu lub usługi"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Opis"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          step="0.01"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Cena"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          name="type"
          value={newProduct.type}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="1">Produkt</option>
          <option value="0">Usługa</option>
        </select>
        {newProduct.type === '1' && (
          <input
            type="number"
            name="availability"
            value={newProduct.availability}
            onChange={handleInputChange}
            placeholder="Dostępność (ilość)"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Dodaj
        </button>
      </div>
    </div>
  );
};

export default DodawanieProduktu;

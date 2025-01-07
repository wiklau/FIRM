import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (newProduct.type === '0') {
      setNewProduct(prevState => ({
        ...prevState,
        availability: '',
      }));
    }
  }, [newProduct.type]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCancel = () => {
    navigate('/produkty');
  }

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

      await axios.post('https://firmtracker-server.onrender.com/api/Products', payload, config);

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
    <div className="min-h-screen flex justify-center pt-14">
      <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-4xl h-max">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Dodaj nowy produkt lub usługę</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div> 
            <label className="block mb-2 text-gray-700 font-medium">Nazwa</label>
            <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Nazwa produktu lub usługi"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          /></div>
          <div>
          <label className="block mb-2 text-gray-700 font-medium">Cena</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Cena"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          </div>
          <div>
          <label className="block mb-2 text-gray-700 font-medium">Typ</label>
          <div className="flex items-center space-x-6">
          <label className="flex items-center space">
              <input
                type="radio"
                name="type"
                value="1"
                checked={newProduct.type === "1"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Produkt</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="0"
                checked={newProduct.type === "0"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Usługa</span>
            </label>
          </div>
          </div>

          <div>
        <label className="block mb-2 text-gray-700 font-medium">Dostępność (ilość)</label>
        <input
          type="number"
          name="availability"
          value={newProduct.type === "0" ? 0 : newProduct.availability}
          onChange={(e) => {
            if (newProduct.type === "1") handleInputChange(e);
          }}
          disabled={newProduct.type === "0"}
          className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            newProduct.type === "0" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "border-gray-300"
          }`}
        />
      </div>
          <div className="col-span-2">
          <label className="block mb-2 text-gray-700 font-medium">Opis</label>
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Opis"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          </div>
          
        </div>
        <div className="mt-6 flex justify-between">
        <button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-800 transition"
          >
            Dodaj
          </button>
          <button
           onClick={handleCancel}
           className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
           >Anuluj</button>
          </div>
      </div>
    </div>
  );
  
  
};

export default DodawanieProduktu;

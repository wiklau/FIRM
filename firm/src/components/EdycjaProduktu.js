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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrors({ general: 'Brak tokena. Użytkownik musi być zalogowany.' });
          return;
        }

        const response = await axios.get(`https://localhost:7039/api/Products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const productData = response.data;
        setProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          type: productData.type.toString(),
          availability: productData.availability || '',
        });
      } catch (error) {
        console.error('Błąd podczas pobierania produktu:', error);
        setErrors({ general: 'Wystąpił błąd podczas pobierania danych produktu.' });
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'type') {
      if (value === '0') {
        setProduct({
          ...product,
          [name]: value,
          availability: '',
        });
      } else {
        setProduct({
          ...product,
          [name]: value,
        });
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const handleSaveChanges = async () => {
    const { name, description, price, type, availability } = product;
    let validationErrors = {};

    if (!name) validationErrors.name = 'Nazwa produktu jest wymagana.';
    if (!description) validationErrors.description = 'Opis produktu jest wymagany.';
    if (!price) validationErrors.price = 'Cena produktu jest wymagana.';
    if (type === '') validationErrors.type = 'Typ produktu jest wymagany.';
    if (price < 0) validationErrors.price = 'Cena nie może być ujemna.';
    if (type === '1' && !availability) validationErrors.availability = 'Dostępność jest wymagana dla produktu.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
        setErrors({ general: 'Brak tokena. Użytkownik musi być zalogowany.' });
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`https://localhost:7039/api/Products/${id}`, payload, config);
      setErrors({});
      navigate('/produkty');
    } catch (error) {
      console.error('Błąd podczas zapisywania zmian:', error);

      if (error.response && error.response.status === 400) {
        setErrors({ general: error.response.data });
      } else {
        setErrors({ general: 'Wystąpił błąd podczas zapisywania zmian. Spróbuj ponownie.' });
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edycja produktu</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

      <div className="grid grid-cols-2 gap-8">
        <div className="relative">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            placeholder="Nazwa produktu lub usługi"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.name && <span className="absolute text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div className="relative">
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Opis"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.description && <span className="absolute text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div className="relative">
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Cena"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.price && <span className="absolute text-red-500 text-sm">{errors.price}</span>}
        </div>

        <div className="relative">
          <select
            name="type"
            value={product.type}
            onChange={handleInputChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="1">Produkt</option>
            <option value="0">Usługa</option>
          </select>
          {errors.type && <span className="absolute text-red-500 text-sm">{errors.type}</span>}
        </div>

        {product.type === '1' && (
          <div className="relative">
            <input
              type="number"
              name="availability"
              value={product.availability}
              onChange={handleInputChange}
              placeholder="Dostępność (ilość)"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.availability && <span className="absolute text-red-500 text-sm">{errors.availability}</span>}
          </div>
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

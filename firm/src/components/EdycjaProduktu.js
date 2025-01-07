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

        const response = await axios.get(`https://firmtracker-server.onrender.com/api/Products/${id}`, {
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

  const handleCancel = () => {
    navigate('/produkty');
  }

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

      await axios.put(`https://firmtracker-server.onrender.com/api/Products/${id}`, payload, config);
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
    <div className="min-h-screen flex justify-center pt-10">
      <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-4xl h-max">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Edycja produktu</h2>
        {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block mb-2 text-gray-700 font-medium">Nazwa</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Nazwa produktu lub usługi"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <span className="absolute text-red-500 text-sm">{errors.name}</span>}
          </div>
          <div className="relative">
            <label className="block mb-2 text-gray-700 font-medium">Cena</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="Cena"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.price && <span className="absolute text-red-500 text-sm">{errors.price}</span>}
          </div>

          <div className="relative">
            <label className="block mb-2 text-gray-700 font-medium">Typ</label>
            <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="1"
                checked={product.type === "1"}
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
                checked={product.type === "0"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Usługa</span>
            </label>
            {errors.type && <span className="absolute text-red-500 text-sm">{errors.type}</span>}
          </div>
          </div>


          <div>
            <label className="block mb-2 text-gray-700 font-medium">Dostępność (ilość)</label>
            <input
              type="number"
              name="availability"
              value={product.type === "0" ? 0 : product.availability}
              onChange={(e) => {
                if (product.type === "1") handleInputChange(e);
              }}
              disabled={product.type === "0"}
              className={`block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${product.type === "0" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "border-gray-300"
                }`}
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-gray-700 font-medium">Opis</label>
            <input
              type="text"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              placeholder="Opis"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSaveChanges}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-800 transition"
          >
            Zapisz zmiany
          </button>
          <button
            onClick={handleCancel}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
          >Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default EdycjaProduktu;

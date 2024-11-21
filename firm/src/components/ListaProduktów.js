import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from '../icons/edit.png';
import koszIcon from '../icons/kosz.png';
import { useNavigate } from 'react-router-dom';

const ListaProduktow = ({ onAdd }) => {
  const [products, setProducts] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://localhost:7039/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }

    if (!deleteProductId) {
      console.error('Brak ID produktu do usunięcia!');
      return;
    }

    try {
      await axios.delete(`https://localhost:7039/api/Products/${deleteProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      setShowModal(false);
      setDeleteProductId(null);
    } catch (error) {
      console.error('Błąd podczas usuwania produktu:', error);
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/produkty/edytuj/${productId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-5xl">Katalog Produktów</h1>
        <button onClick={onAdd} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Dodaj Produkt
        </button>
      </div>
      <div className="mt-5">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Produkt</th>
              <th className="p-2 border">Opis</th>
              <th className="p-2 border">Cena</th>
              <th className="p-2 border">Dostępność</th>
              <th className="p-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-2 border">{product.id}</td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.description}</td>
                <td className="p-2 border">{parseFloat(product.price).toFixed(2)}</td>
                <td className="p-2 border">{product.availability}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="mr-2 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    <img src={editIcon} alt="Edytuj" className="inline w-5 mr-2" />
                    Edytuj
                  </button>
                  <button
                    onClick={() => {
                      setDeleteProductId(product.id);
                      setShowModal(true);
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded"
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Czy na pewno chcesz usunąć ten produkt?</h2>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteProduct}
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

export default ListaProduktow;

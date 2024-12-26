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
      <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6">
        <h1 className="text-white text-4xl font-semibold">Katalog Produktów oraz usług</h1>
        <button onClick={onAdd} className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-800 transition">
          Dodaj Produkt
        </button>
      </div>
      <div className="mt-5">
        <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Produkt</th>
              <th className="p-3 text-left">Opis</th>
              <th className="p-3 text-left">Cena</th>
              <th className="p-3 text-center">Dostępność</th>
              <th className="p-3 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">{product.id}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">{parseFloat(product.price).toFixed(2)} zł</td>
                <td className="p-3 text-center">
                  {product.type === 0 ? "" : product.availability}
                </td>
                <td className="p-3 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition"
                  >
                    <img src={editIcon} alt="Edytuj" className="inline w-5 mr-2" />
                    Edytuj
                  </button>
                  <button
                    onClick={() => {
                      setDeleteProductId(product.id);
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
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

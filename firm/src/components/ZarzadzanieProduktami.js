import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from "../icons/edit.png";
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";

const ZarzadzanieProduktami = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    type: "",
    availability: ""
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Products');
      setProducts(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'text/json'
        }
      };
      await axios.post('https://localhost:7039/api/Products', newProduct, config);
      fetchProducts();
      setIsModalOpen(false);
      setNewProduct({
        name: "",
        availability: "",
        price: "",
        type: ""
      });
    } catch (error) {
      console.error('Błąd podczas dodawania produktu:', error);
    }
  };

  return (
    <div className='p-10 ml-11'>
      <div className='flex items-center justify-between'>
        <div className='h-20 text-5xl ml-1'>
          Katalog Produktów
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj</button>
      </div>
      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Dodaj nowy produkt</h2>
            <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Nazwa produktu" className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Opis" className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Cena" className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" name="type" value={newProduct.type} onChange={handleInputChange} placeholder="Typ" className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" name="availability" value={newProduct.availability} onChange={handleInputChange} placeholder="Dostępność" className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg" />
            <button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Dodaj produkt</button>
            <button onClick={() => setIsModalOpen(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Anuluj</button>
          </div>
        </div>
      )}
      <div className="w-8/10 mx-auto mt-2">
        <div className="h-64 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">Produkt</th>
                <th className="border border-gray-300 p-2">Opis</th>
                <th className="border border-gray-300 p-2">Cena</th>
                <th className="border border-gray-300 p-2">Kategoria</th>
                <th className="border border-gray-300 p-2">Dostępność</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">{product.description}</td>
                  <td className="border border-gray-300 p-2">{product.price}</td>
                  <td className="border border-gray-300 p-2">{product.type}</td>
                  <td className="border border-gray-300 p-2">{product.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-start mt-4">
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex"><img src={editIcon} alt="" className="w-8 h-8 mr-2" />Edytuj</button>
          <button className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex"><img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń</button>
        </div>
      </div>
    </div>
  );
}

export default ZarzadzanieProduktami;

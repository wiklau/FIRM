import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from "../icons/edit.png";
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";

const Transakcje = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    id: 1,
    date: "",
    employeeId: "",
    transactionProducts: [
      {
        id: 0,
        transactionId: 0,
        productID: "",
        quantity:""
      }
    ],
    paymentType: "",
    discount: "",
    description: "",
    totalPrice: 0
  });

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Transaction');
      setTransactions(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania transakcji:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    try {
      await axios.post('https://localhost:7039/api/Transaction', newTransaction);
      fetchTransactions();
      setIsModalOpen(false);
      setNewTransaction({
        id: 1,
        date: "",
        employeeId: "",
        transactionProducts: [
          {
            id: 0,
            transactionId: 0,
            productID: "",
            quantity: ""
          }
        ],
        paymentType: "",
        discount: "",
        description: "",
        totalPrice: 0
      });
    } catch (error) {
      console.error('Błąd podczas dodawania transakcji:', error);
    }
  };

  return (
    <div className='p-10 ml-11'>
      <div className='flex items-center justify-between'>
        <div className='h-20 text-5xl ml-1'>
          Lista Transakcji
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex">
          <img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj
        </button>
      </div>
      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Dodaj nową transakcję</h2>
            <input
              type="datetime-local"
              name="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              placeholder="Data"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="employeeId"
              value={newTransaction.employeeId}
              onChange={(e) => setNewTransaction({ ...newTransaction, employeeId: e.target.value })}
              placeholder="Nr. Pracownika"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            {newTransaction.transactionProducts.map((product, index) => (
              <div key={index}>
                <input
                  type="number"
                  name={`productID-${index}`}
                  value={product.productID}
                  onChange={(e) => {
                    const newTransactionProducts = [...newTransaction.transactionProducts];
                    newTransactionProducts[index].productID = e.target.value;
                    setNewTransaction({ ...newTransaction, transactionProducts: newTransactionProducts });
                  }}
                  placeholder="ID Produktu"
                  className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  name={`quantity-${index}`}
                  value={product.quantity}
                  onChange={(e) => {
                    const newTransactionProducts = [...newTransaction.transactionProducts];
                    newTransactionProducts[index].quantity = e.target.value;
                    setNewTransaction({ ...newTransaction, transactionProducts: newTransactionProducts });
                  }}
                  placeholder="Ilość"
                  className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <input
              type="text"
              name="paymentType"
              value={newTransaction.paymentType}
              onChange={(e) => setNewTransaction({ ...newTransaction, paymentType: e.target.value })}
              placeholder="Sposób płatności"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="discount"
              value={newTransaction.discount}
              onChange={(e) => setNewTransaction({ ...newTransaction, discount: e.target.value })}
              placeholder="Rabat"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              placeholder="Opis"
              className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddTransaction}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Dodaj transakcję
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
      <div className="w-8/10 mx-auto mt-2">
        <div className="h-64 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Data</th>
                <th className="border border-gray-300 p-2">Produkt</th>
                <th className="border border-gray-300 p-2">Ilość</th>
                <th className="border border-gray-300 p-2">Sposób płatności</th>
                <th className="border border-gray-300 p-2">Nr. Pracownika</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 p-2">{transaction.id}</td>
                  <td className="border border-gray-300 p-2">{transaction.date}</td>
                  <td className="border border-gray-300 p-2">
                    {transaction.transactionProducts.map(product => (
                  <div key={product.id}>{product.product.name}</div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {transaction.transactionProducts.map(product => (
                      <div key={product.id}>{product.quantity}</div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">{transaction.paymentType}</td>
                  <td className="border border-gray-300 p-2">{transaction.employeeId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-start mt-4">
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex">
            <img src={editIcon} alt="" className="w-8 h-8 mr-2" />Edytuj
          </button>
          <button className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex">
            <img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transakcje;

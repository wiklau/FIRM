import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ReactComponent as MinusIcon } from "../icons/minus-icon.svg";
import Select from "react-select";
import DatePicker from "./DatePicker";

const EdycjaTransakcji = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState({
    id: 2,
    date: "",
    employeeId: 1,
    transactionProducts: [],
    paymentType: "",
    discount: "",
    description: "",
    totalPrice: 0,
  });
  const [products, setProducts] = useState([]);
  const [pendingRemovals, setPendingRemovals] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Brak tokena. Użytkownik musi być zalogowany.");
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchTransactionData = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const [transactionRes, productsRes] = await Promise.all([
          axios.get(`https://firmtracker-server.onrender.com/api/transaction/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://firmtracker-server.onrender.com/api/Products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const updatedTransaction = {
          ...transactionRes.data,
          transactionProducts: transactionRes.data.transactionProducts.map((tp) => ({
            id: tp.id,
            transactionId: transactionRes.data.id,
            productID: tp.product.id,
            productName: tp.product.name,
            quantity: tp.quantity,
          })),
        };
        setTransaction(updatedTransaction);

        const productOptions = productsRes.data.map((product) => ({
          value: product.id,
          label: product.name,
        }));
        setProducts(productOptions);
      } catch (err) {
        setError("Wystąpił błąd podczas ładowania danych.");
      }
    };

    fetchTransactionData();
  }, [id]);

  const validateForm = () => {
    const validationErrors = {};
    if (!transaction.date) validationErrors.date = "Data transakcji jest wymagana.";
    if (transaction.transactionProducts.length === 0)
      validationErrors.transactionProducts = "Transakcja musi zawierać co najmniej jeden produkt.";
    else {
      transaction.transactionProducts.forEach((product, index) => {
        if (!product.productID) validationErrors[`productID_${index}`] = "Produkt jest wymagany.";
        if (!product.quantity || product.quantity <= 0)
          validationErrors[`quantity_${index}`] = "Ilość musi być większa niż 0.";
      });
    }
    if (!transaction.paymentType) validationErrors.paymentType = "Sposób płatności jest wymagany.";
    if (transaction.discount < 0) validationErrors.discount = "Rabat nie może być ujemny.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleCancel = () => {
    navigate("/transakcje");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleAddProduct = () => {
    setTransaction((prev) => ({
      ...prev,
      transactionProducts: [
        ...prev.transactionProducts,
        { id: null, transactionId: prev.id, productID: 0, productName: "", quantity: "" },
      ],
    }));
  };

  const handleProductChange = (index, selectedOption) => {
    setTransaction((prev) => {
      const updatedProducts = prev.transactionProducts.map((product, i) =>
        i === index
          ? { ...product, productID: selectedOption.value, productName: selectedOption.label }
          : product
      );
      return { ...prev, transactionProducts: updatedProducts };
    });
    setErrors((prevErrors) => ({ ...prevErrors, [`productID_${index}`]: null }));
  };

  const handleQuantityChange = (index, quantity) => {
    setTransaction((prev) => {
      const updatedProducts = prev.transactionProducts.map((product, i) =>
        i === index ? { ...product, quantity } : product
      );
      return { ...prev, transactionProducts: updatedProducts };
    });
    setErrors((prevErrors) => ({ ...prevErrors, [`quantity_${index}`]: null }));
  };

  const handleRemoveProduct = (index) => {
    const productToRemove = transaction.transactionProducts[index];

    setTransaction((prev) => ({
      ...prev,
      transactionProducts: prev.transactionProducts.filter((_, i) => i !== index),
    }));

    if (productToRemove.id) {
      setPendingRemovals((prev) => [...prev, productToRemove]);
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const token = getToken();
    if (!token) return;

    const updatedTransaction = {
      ...transaction,
      transactionProducts: transaction.transactionProducts.map((tp) => ({
        id: tp.id || 0,
        transactionId: transaction.id,
        productID: tp.productID,
        productName: tp.productName,
        quantity: Number(tp.quantity),
      })),
    };

    try {
      await axios.put(
        `https://firmtracker-server.onrender.com/api/transaction/${transaction.id}`,
        updatedTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      for (const product of pendingRemovals) {
        await axios.delete(
          `https://firmtracker-server.onrender.com/api/Transaction/${transaction.id}/product/${product.productID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate("/transakcje");
    } catch (err) {
      setError(err.response?.data || "Wystąpił błąd podczas zapisywania zmian.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edytuj transakcję</h2>
  
      {error && <p className="text-red-500 mb-4">{error}</p>}
  
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Data transakcji</label>
          <DatePicker
            type="datetime-local"
            name="date"
            value={transaction.date}
            onChange={handleInputChange}
            className="flex-1 mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxDate="2099-12-31T23:59"
          />
          {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
        </div>
      </div>
      <label className="block mb-2 text-gray-700 font-medium">Produkty transkacji</label>
      <div className="border border-gray-300 rounded-lg shadow-sm p-4 h-80 overflow-y-scroll">
        {transaction.transactionProducts.map((product, index) => (
          <div key={index} className="mb-4 flex items-center space-x-4">
            <Select
              name={`productName-${index}`}
              value={products.find((option) => option.value === product.productID)}
              onChange={(selectedOption) => handleProductChange(index, selectedOption)}
              options={products}
              className="flex-1"
              placeholder="Wybierz produkt..."
            />
            <input
              type="number"
              name={`quantity-${index}`}
              value={product.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              placeholder="Ilość"
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
                <button
                  onClick={() => handleRemoveProduct(index)}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition focus:outline-none ${transaction.transactionProducts.length > 1
                      ? "text-gray-500 hover:text-red-600 hover:bg-red-100 active:bg-red-200"
                      : "text-gray-300 cursor-not-allowed"
                    }`}
                  disabled={transaction.transactionProducts.length <= 1}
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
          </div>
        ))}
        <button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition mb-3"
        >
          Dodaj produkt
        </button>
      </div>
  
      <div className="mt-6 flex justify-between">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Metoda płatności</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="BLIK"
                checked={transaction.paymentType === "BLIK"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">BLIK</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="Gotówka"
                checked={transaction.paymentType === "Gotówka"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Gotówka</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="Karta płatnicza"
                checked={transaction.paymentType === "Karta płatnicza"}
                onChange={handleInputChange}
                className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Karta płatnicza</span>
            </label>
          </div>
        </div>
  
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Rabat (%)</label>
          <input
            type="number"
            name="discount"
            value={transaction.discount}
            onChange={handleInputChange}
            placeholder="Rabat"
            min="0"
            max="100"
            className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
  
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Opis</label>
        <input
          type="text"
          name="description"
          value={transaction.description}
          onChange={handleInputChange}
          placeholder="Opis"
          className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleSaveChanges}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition"
        >
          Zapisz zmiany
        </button>
  
        <button
          onClick={handleCancel}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 transition"
        >
          Anuluj
        </button>
      </div>
    </div>
  );    
};

export default EdycjaTransakcji;

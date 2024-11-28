import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const EdycjaTransakcji = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState({
    id: 2,
    date: "",
    employeeId: "",
    transactionProducts: [],
    paymentType: "",
    discount: "",
    description: "",
    totalPrice: 0,
  });
  const [products, setProducts] = useState([]);
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
          axios.get(`https://localhost:7039/api/transaction/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://localhost:7039/api/Products", {
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
        console.error(err);
        setError("Wystąpił błąd podczas ładowania danych.");
      }
    };

    fetchTransactionData();
  }, [id]);

  const validateForm = () => {
    const validationErrors = {};
    if (!transaction.date) validationErrors.date = "Data transakcji jest wymagana.";
    if (!transaction.employeeId || transaction.employeeId <= 0) validationErrors.employeeId = "Numer pracownika jest błędny.";
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

  const handleRemoveProduct = async (index) => {
    const token = getToken();
    if (!token) {
      console.error("Brak tokena, nie można usunąć produktu.");
      setError("Użytkownik musi być zalogowany.");
      return;
    }
  
    const productToRemove = transaction.transactionProducts[index];
    console.log(productToRemove);
  
    if (!productToRemove || !productToRemove.id) {
      console.error("Nie znaleziono ID transakcyjnego produktu. Usuwanie lokalne.");
      setTransaction((prev) => ({
        ...prev,
        transactionProducts: prev.transactionProducts.filter((_, i) => i !== index),
      }));
      return;
    }
  
    try {
      await axios.delete(
        `https://localhost:7039/api/Transaction/${transaction.id}/product/${productToRemove.productID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Produkt o ID transakcji ${productToRemove.id} został usunięty.`);
  
      setTransaction((prev) => ({
        ...prev,
        transactionProducts: prev.transactionProducts.filter((_, i) => i !== index),
      }));
    } catch (err) {
      console.error("Błąd podczas usuwania produktu:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Nie udało się usunąć produktu. Spróbuj ponownie.");
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
        `https://localhost:7039/api/transaction/${transaction.id}`,
        updatedTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/transakcje");
    } catch (err) {
      console.error(err);
      setError(err.response.data);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edycja Transakcji</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="datetime-local"
          name="date"
          value={transaction.date}
          onChange={handleInputChange}
          placeholder="Data"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="employeeId"
          value={transaction.employeeId}
          onChange={handleInputChange}
          placeholder="Nr. Pracownika"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.employeeId && <span className="text-red-500 text-sm">{errors.employeeId}</span>}
      </div>
      {transaction.transactionProducts.map((product, index) => (
        <div key={index} className="mb-4">
          <Select
            value={products.find((p) => p.value === product.productID) || null}
            onChange={(option) => handleProductChange(index, option)}
            options={products}
            className="mb-2"
            placeholder="Wybierz produkt"
          />
          {errors[`productID_${index}`] && (
            <span className="text-red-500 text-sm">{errors[`productID_${index}`]}</span>
          )}
          <input
            type="number"
            value={product.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            placeholder="Ilość"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors[`quantity_${index}`] && (
            <span className="text-red-500 text-sm">{errors[`quantity_${index}`]}</span>
          )}
          <button
            onClick={() => handleRemoveProduct(index)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Usuń
          </button>
        </div>
      ))}
      <button
        onClick={handleAddProduct}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Dodaj produkt
      </button>
      <div className="mb-4">
        <input
          type="text"
          name="paymentType"
          value={transaction.paymentType}
          onChange={handleInputChange}
          placeholder="Sposób płatności"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.paymentType && (
          <span className="text-red-500 text-sm">{errors.paymentType}</span>
        )}
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="discount"
          value={transaction.discount}
          onChange={handleInputChange}
          placeholder="Rabat"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.discount && <span className="text-red-500 text-sm">{errors.discount}</span>}
      </div>
      <button
        onClick={handleSaveChanges}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Zapisz zmiany
      </button>
    </div>
  );
};

export default EdycjaTransakcji;

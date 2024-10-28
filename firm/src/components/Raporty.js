import React, { useState, useEffect } from 'react';
import axios from 'axios';
import koszIcon from "../icons/kosz.png";
import ConfirmationModal from './ConfirmationModal';

const Raporty = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [deleteReportId, setDeleteReportId] = useState(null);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }
    try {
      const response = await axios.get('https://localhost:7039/api/Report', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania raportów:', error);
    }
  };

  const openDeleteConfirmation = (transactionId) => {
    setDeleteReportId(transactionId);
  };

  const closeDeleteConfirmation = () => {
    setDeleteReportId(null);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) {
      setError('Proszę uzupełnić wszystkie pola.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      console.log('Wysyłane dane:', fromDate, toDate);
      const response = await axios.post('https://localhost:7039/api/Report', {
        fromDate,
        toDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newReport = response.data;
      setReports([...reports, newReport]);
    } catch (error) {
      console.error('Błąd podczas generowania raportu:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };

  const handleDeleteReport = async (reportId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:7039/api/Report/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchReports();
      setDeleteReportId(null);
    } catch (error) {
      console.error('Błąd podczas usuwania raportu:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', options).replace(",", "");
  };

  return (
    <div className="p-10 ml-11">
      <div className="flex items-center justify-between">
        <div className="h-20 text-5xl ml-1">
          Generowanie raportów
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="fromDate" className="mr-3">Od:</label>
        <input type="datetime-local" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mr-5" />
        <label htmlFor="toDate" className="mr-3">Do:</label>
        <input type="datetime-local" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mr-5" />
        <button onClick={handleGenerateReport} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generuj</button>
      </div>
      <div className="mt-5">
        <h2 className="text-2xl font-bold mb-4">Raporty</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 top-0 z-10">
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Data od</th>
              <th className="border border-gray-300 p-2">Data do</th>
              <th className="border border-gray-300 p-2">Suma dochodów</th>
              <th className="border border-gray-300 p-2">Suma wydatków</th>
              <th className="border border-gray-300 p-2">Bilans</th>
              <th className="border border-gray-300 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td className="border border-gray-300 p-2">{report.id}</td>
                <td className="border border-gray-300 p-2">{formatDate(report.fromDate)}</td>
                <td className="border border-gray-300 p-2">{formatDate(report.toDate)}</td>
                <td className="border border-gray-300 p-2">{report.totalIncome}</td>
                <td className="border border-gray-300 p-2">{report.totalExpenses}</td>
                <td className="border border-gray-300 p-2">{report.totalBalance}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => openDeleteConfirmation(report.id)} className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex">
                    <img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Błąd</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Zamknij
            </button>
          </div>
        </div>
      )}
      {deleteReportId && (
        <ConfirmationModal
          message="Czy na pewno chcesz usunąć ten raport?"
          onCancel={closeDeleteConfirmation}
          onConfirm={() => handleDeleteReport(deleteReportId)}
        />
      )}
    </div>
  );
};

export default Raporty;

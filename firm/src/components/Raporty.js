import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ReactComponent as KoszIcon} from '../icons/delete.svg';

const Raporty = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const validateYear = (dateString) => {
    const year = dateString.split('-')[0];
    return year.length === 4 && /^\d{4}$/.test(year);
  };
  
  const handleFromDateChange = (e) => {
    const value = e.target.value;
    if (validateYear(value)) {
      setFromDate(value);
      setError(null);
    } else {
      setError('Rok w dacie "Od" musi być 4-cyfrowy.');
    }
  };
  
  const handleToDateChange = (e) => {
    const value = e.target.value;
    if (validateYear(value)) {
      setToDate(value);
      setError(null);
    } else {
      setError('Rok w dacie "Do" musi być 4-cyfrowy.');
    }
  };
  
  const openDeleteConfirmation = (reportId) => {
    setDeleteReportId(reportId);
    setShowDeleteModal(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteModal(false);
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
      closeDeleteConfirmation();
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
      <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6">
        <h1 className="text-white text-4xl font-semibold">Generowanie raportów</h1>
      </div>

      <div className="bg-white shadow-lg p-8 rounded-xl max-w-3xl mx-auto">
        <div className="mb-6 flex items-center space-x-6">
          <div className="flex-1">
            <label htmlFor="fromDate" className="block text-lg font-medium text-gray-700 mb-2">Od:</label>
            <input
              type="datetime-local"
              id="fromDate"
              value={fromDate}
              onChange={handleFromDateChange}              
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="toDate" className="block text-lg font-medium text-gray-700 mb-2">Do:</label>
            <input
              type="datetime-local"
              id="toDate"
              value={toDate}
              onChange={handleToDateChange}              
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out"
        >
          Generuj raport
        </button>

        {error && (
          <div className="mt-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
      </div>




      <div className="mt-5">
        <table className="min-w-full border-collapse table-auto shadow-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Data od</th>
              <th className="p-2 text-left">Data do</th>
              <th className="p-2 text-left">Suma dochodów</th>
              <th className="p-2 text-left">Suma wydatków</th>
              <th className="p-2 text-left">Bilans</th>
              <th className="p-2 text-center">Usuń</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="group hover:bg-gray-100 transition-colors">
                <td className="p-2">{report.id}</td>
                <td className="p-2">{formatDate(report.fromDate)}</td>
                <td className="p-2">{formatDate(report.toDate)}</td>
                <td className="p-2">{report.totalIncome}</td>
                <td className="p-2">{report.totalExpenses}</td>
                <td className="p-2">{report.totalBalance}</td>
                <td className="p-3 flex justify-center space-x-2">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => openDeleteConfirmation(report.id)}
                      className="text-red-500 hover:bg-red-200 active:bg-red-300 focus:outline-none p-2 rounded-full transition-colors"
                    >
                      <KoszIcon className = "w-5 h-5"/>
                    </button>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Czy na pewno chcesz usunąć ten raport?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => handleDeleteReport(deleteReportId)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Tak
              </button>
              <button
                onClick={closeDeleteConfirmation}
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

export default Raporty;

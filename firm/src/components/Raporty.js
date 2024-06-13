import React, { useState, useEffect } from 'react';
import axios from 'axios';
import koszIcon from "../icons/kosz.png";

const Raporty = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Report');
      setReports(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania raportów:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('https://localhost:7039/api/Report', {
        fromDate,
        toDate
      });
      const newReport = response.data;
      setReports([...reports, newReport]);
    } catch (error) {
      console.error('Błąd podczas generowania raportu:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(`https://localhost:7039/api/Report?${reportId}`);
      setReports(reports.filter(report => report.id !== reportId)); // Update state after deletion
    } catch (error) {
      console.error('Błąd podczas usuwania raportu:', error);
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
        <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mr-5" />
        <label htmlFor="toDate" className="mr-3">Do:</label>
        <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mr-5" />
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
                  <button onClick={() => handleDeleteReport(report.id)} className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex">
                    <img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Raporty;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WidokHarmonogramu from './WidokHarmonogramu';
import DatePicker from './DatePicker';

const PanelAdministratora = () => {
  const [selectedOption, setSelectedOption] = useState('harmonogramy');
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [workdays, setWorkdays] = useState([]);
  const [absenceType, setAbsenceType] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [changePasswordEmail, setChangePasswordEmail] = useState('');
  const [changePasswordValue, setChangePasswordValue] = useState('');
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!userEmail) newErrors.email = "Pole email jest wymagane.";
    if (!userPassword) newErrors.password = "Pole hasło jest wymagane.";
    if (!userRole) newErrors.role = "Wybór roli jest wymagany.";
    return newErrors;
  };

  const addUser = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      await axios.post(
        "https://localhost:7039/api/user/create",
        {
          login: userEmail,
          email: userEmail,
          password: userPassword,
          role: userRole,
          newEncryption: true,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUserEmail("");
      setUserPassword("");
      setUserRole("");
    } catch (error) {
      console.error("Błąd podczas tworzenia konta:", error);
    }
  };


  const fetchEmails = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/user/emails', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEmails(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania emaili:', error);
    }
  };


  const changePassword = async () => {
    if (!changePasswordEmail || !changePasswordValue) {
      alert("Wszystkie pola muszą być wypełnione!");
      return;
    }
  
    try {
      await axios.post(
        'https://localhost:7039/api/user/ChangeUserPassword',
        {
          email: changePasswordEmail,
          password: changePasswordValue,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
  
      setChangePasswordEmail('');
      setChangePasswordValue('');
    } catch (error) {
      console.error('Błąd podczas zmiany hasła:', error);
    }
  };

  const addAbsence = async () => {
    if (!selectedEmail || !absenceType || !startDate || !endDate) {
      alert("Wszystkie pola muszą być wypełnione!");
      return;
    }

    try {
      await axios.post('https://localhost:7039/api/Workday/absence/add', {
        userEmail: selectedEmail,
        absenceType: absenceType,
        startTime: startDate,
        endTime: endDate,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log("Absencja wysłana");
    } catch (error) {
      console.error('Błąd podczas dodawania absencji:', error);
    }
  };

  const downloadReport = async () => {
    if (!reportType || !startDate || !endDate) {
      alert("Wszystkie pola muszą być wypełnione!");
      return;
    }

    try {
      const response = await axios.get('https://localhost:7039/api/Pdf/download', {
        params: {
          reportType: reportType,
          startDate: startDate,
          endDate: endDate,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `raport_${reportType}_${startDate}_${endDate}.pdf`;
      link.click();
    } catch (error) {
      console.error('Błąd podczas pobierania raportu:', error);
    }
  };

  const fetchWorkdays = async (userEmail) => {
    if (!userEmail) {
      setWorkdays([]); 
      return;
    }

    try {
      const response = await axios.get(`https://localhost:7039/api/Workday/user/${userEmail}/workdays`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWorkdays(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania harmonogramu:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchEmails();
    }
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      fetchWorkdays(selectedEmail);
    }
  }, [selectedEmail]);

  return (
    <div className='p-10 ml-11'>
      <div className='flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6'>
        <h1 className="text-white text-4xl font-semibold">Panel administratora</h1>
        <div className="mr-10 text-lg flex">
          <div className='px-5'>
            <button 
              onClick={() => setSelectedOption('harmonogramy')} 
              className={`
                ${selectedOption === 'harmonogramy' ? 'text-white font-bold' : 'text-gray-200'}
                hover:text-white hover:bg-blue-600 hover:rounded-lg transition duration-300 ease-in-out
              `}>
              Harmonogramy
            </button>
          </div>
          <div className='px-5'>
            <button 
              onClick={() => setSelectedOption('absencje')} 
              className={`
                ${selectedOption === 'absencje' ? 'text-white font-bold' : 'text-gray-200'}
                hover:text-white hover:bg-teal-600 hover:rounded-lg transition duration-300 ease-in-out
              `}>
              Absencje
            </button>
          </div>
          <div className='px-5'>
            <button 
              onClick={() => setSelectedOption('raporty')} 
              className={`
                ${selectedOption === 'raporty' ? 'text-white font-bold' : 'text-gray-200'}
                hover:text-white hover:bg-indigo-600 hover:rounded-lg transition duration-300 ease-in-out
              `}>
              Raporty
            </button>
          </div>
          <div className='px-5'>
            <button 
              onClick={() => setSelectedOption('konta')} 
              className={`
                ${selectedOption === 'konta' ? 'text-white font-bold' : 'text-gray-200'}
                hover:text-white hover:bg-indigo-600 hover:rounded-lg transition duration-300 ease-in-out
              `}>
              Konta
            </button>
          </div>
          <div className='px-5'>
            <button 
              onClick={() => setSelectedOption('hasła')} 
              className={`
                ${selectedOption === 'hasła' ? 'text-white font-bold' : 'text-gray-200'}
                hover:text-white hover:bg-indigo-600 hover:rounded-lg transition duration-300 ease-in-out
              `}>
              Hasła
            </button>
          </div>
        </div>
      </div>

      

      {selectedOption === 'raporty' && (
        <div className="flex justify-center items-start pt-10">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-center mb-4">Pobierz raport</h2>

              <div className="mb-4">
                <label htmlFor="reportType" className="block text-lg font-medium text-gray-700 mb-2">Wybierz typ raportu:</label>
                <select 
                  id="reportType" 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wybierz...</option>
                  <option value="expenses">Wydatki</option>
                  <option value="transactions">Transakcje</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="startDate" className="block text-lg font-medium text-gray-700 mb-2">Wybierz datę początkową:</label>
                <DatePicker
                  type="datetime-local" 
                  id="startDate" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxDate="2099-12-31T23:59"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="endDate" className="block text-lg font-medium text-gray-700 mb-2">Wybierz datę końcową:</label>
                <DatePicker
                  type="datetime-local" 
                  id="endDate" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxDate="2099-12-31T23:59"
                />
              </div>

              <button 
                onClick={downloadReport} 
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                Pobierz raport
              </button>
            </div>
          </div>
        </div>


      )}

      {selectedOption === 'harmonogramy' && (
        <div className="flex justify-center items-start pt-10">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full">
            <div className="mb-6">

              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Wybierz email:</label>
                <select 
                  id="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wybierz...</option>
                  {emails.map((email) => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>
              {selectedEmail && (
                <WidokHarmonogramu email={selectedEmail} workdays={workdays} />
              )}
            </div>
          </div>
        </div>
      )}

      {selectedOption === 'absencje' && (
        <div className="flex justify-center items-start pt-10">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-center mb-4">Dodaj absencję</h2>

              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Wybierz email:</label>
                <select 
                  id="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wybierz...</option>
                  {emails.map((email) => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="absenceType" className="block text-lg font-medium text-gray-700 mb-2">Typ absencji:</label>
                <select 
                  id="absenceType" 
                  value={absenceType} 
                  onChange={(e) => setAbsenceType(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wybierz...</option>
                  <option value="sick">Chorobowe</option>
                  <option value="vacation">Urlop</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="startDate" className="block text-lg font-medium text-gray-700 mb-2">Wybierz datę początkową:</label>
                <DatePicker
                  type="datetime-local" 
                  id="startDate" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxDate="2099-12-31T23:59"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="endDate" className="block text-lg font-medium text-gray-700 mb-2">Wybierz datę końcową:</label>
                <DatePicker
                  type="datetime-local" 
                  id="endDate" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxDate="2099-12-31T23:59"
                />
              </div>

              <button 
                onClick={addAbsence} 
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                Dodaj absencję
              </button>
            </div>
          </div>
        </div>

      )}
    {selectedOption === 'konta' && (
      <div className="flex justify-center items-start pt-10">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-center mb-4">Dodaj konto</h2>

            <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Hasło:
            </label>
            <input
              type="password"
              id="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className={`w-full p-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-lg font-medium text-gray-700 mb-2">
              Rola:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={userRole === "user"}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="form-radio text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">User</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={userRole === "admin"}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="form-radio text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>



            <button
              onClick={addUser}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Dodaj konto
            </button>
          </div>
        </div>
      </div>
    )}
      {selectedOption === 'hasła' && (
        <div className="flex justify-center items-start pt-10">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-center mb-4">Zmień hasło</h2>

              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Wybierz email:</label>
                <select 
                  id="email"
                  value={changePasswordEmail}
                  onChange={(e) => setChangePasswordEmail(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Wybierz...</option>
                  {emails.map((email) => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="changePasswordValue" className="block text-lg font-medium text-gray-700 mb-2">
                  Nowe hasło:
                </label>
                <input
                  type="password"
                  id="changePasswordValue"
                  value={changePasswordValue}
                  onChange={(e) => setChangePasswordValue(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={changePassword}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                Zmień hasło
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdministratora;

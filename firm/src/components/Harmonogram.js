import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Harmonogram = () => {
  const [workdays, setWorkdays] = useState([]);
  const [email, setEmail] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [manualDateChange, setManualDateChange] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setEmail(decodedToken.email);
      fetchWorkdays(decodedToken.email);
    }

    const interval = setInterval(() => {
      if (!manualDateChange) { 
        setCurrentDate(new Date());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [manualDateChange]);

  const fetchWorkdays = async (email) => {
    try {
      const response = await axios.get(`https://localhost:7039/api/Workday/user/${email}/workdays`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWorkdays(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania dni roboczych:', error);
    }
  };

  const handleStartWorkday = async (date) => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }

    try {
      await axios.post(
        'https://localhost:7039/api/workday/start',
        { date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Dzień roboczy rozpoczęty!');
      fetchWorkdays(email);
    } catch (error) {
      console.error(error);
    }
  };

  const isWorkday = (date) => {
    return workdays.includes(date);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDayOfWeek = (date) => {
    const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
    return daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generateDaysInMonth = () => {
    const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const lastDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
  
    const firstDayWeekday = (firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1);
    const numberOfDaysInMonth = lastDayOfMonth.getDate();
  
    const days = [];
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
  
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      days.push(i);
    }
  
    setDaysInMonth(days);
  };

  useEffect(() => {
    generateDaysInMonth();
  }, [displayDate]);

  const changeMonth = (direction) => {
    setManualDateChange(true);
    const newDate = new Date(displayDate);
    if (direction === 'previous') {
      newDate.setMonth(displayDate.getMonth() - 1);
    } else if (direction === 'next') {
      newDate.setMonth(displayDate.getMonth() + 1);
    }
    setDisplayDate(newDate);
    setTimeout(() => setManualDateChange(false), 1000);
  };

  const formatMonth = (monthIndex) => {
    const months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
    ];
    return months[monthIndex];
  };

  return (
  <div className="container mx-auto px-4 py-6">
    <div className="flex justify-between items-center mb-6">
      <div className="text-lg font-semibold">
        <p>{formatDate(currentDate)} - {formatDayOfWeek(currentDate)}</p>
        <p>{formatTime(currentDate)}</p>
      </div>
    </div>

    <div className="flex justify-between items-center mb-4">
      <button 
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => changeMonth('previous')}
      >
        Poprzedni miesiąc
      </button>
      <h2 className="text-2xl font-bold">{formatMonth(displayDate.getMonth())} {displayDate.getFullYear()}</h2>
      <button 
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => changeMonth('next')}
      >
        Następny miesiąc
      </button>
    </div>

    <div className="grid grid-cols-7 gap-4">
      {['P', 'W', 'Ś', 'C', 'P', 'S', 'N'].map((day, index) => (
        <div key={index} className="text-center font-semibold">{day}</div>
      ))}
      {daysInMonth.map((day, index) => (
        <div
          key={index}
          className={`text-center py-5 rounded-lg ${day ? 'cursor-pointer' : 'text-transparent'} 
          ${day && 'bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out'} 
          ${isWorkday(formatDate(new Date(displayDate.getFullYear(), displayDate.getMonth(), day))) && 'bg-green-200'}`}
          style={{
            boxShadow: day ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onClick={() => day && handleStartWorkday(new Date(displayDate.getFullYear(), displayDate.getMonth(), day))}
        >
          {day}
        </div>
      ))}
    </div>
  </div>
  );
};

export default Harmonogram;

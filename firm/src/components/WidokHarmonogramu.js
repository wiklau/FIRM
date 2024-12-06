import React, { useState, useEffect } from 'react';

const WidokHarmonogramu = ({ workdays }) => {
    const [displayDate, setDisplayDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [manualDateChange, setManualDateChange] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
  
    useEffect(() => {
      generateDaysInMonth();
    }, [displayDate]);
  
    const generateDaysInMonth = () => {
      const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
      const lastDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
  
      const firstDayWeekday = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
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
  
    const handleDayClick = (day) => {
      const workDay = workdays.find((workday) => {
        const workDayDate = new Date(workday.startTime).toLocaleDateString();
        const selectedDayDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day).toLocaleDateString();
        return workDayDate === selectedDayDate;
      });
      setSelectedDay(workDay || null);
    };
  
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const formatWorkedHours = (workedHours) => {
      const [hours, minutes, seconds] = workedHours.split(':');
    
      return `${hours}:${minutes}:${Math.floor(parseFloat(seconds)).toString().padStart(2, '0')}`;
    };
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
    return (
      <div className="container mx-auto px-4 py-6">
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
              ${workdays.some(workday => new Date(workday.startTime).getDate() === day) && 'bg-green-200'}`}
              style={{
                boxShadow: day ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              }}
              onClick={() => day && handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
  
        {selectedDay && (
          <div className="modal fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Godziny pracy</h2>
              <p><strong>Dzień:</strong> {formatDate(new Date(selectedDay.startTime))}</p>
              <p><strong>Start:</strong> {formatTime(new Date(selectedDay.startTime))}</p>
              <p><strong>Stop:</strong> {formatTime(new Date(selectedDay.endTime))}</p>
              <p><strong>Godziny pracy:</strong> {formatWorkedHours(selectedDay.workedHours)}</p>
              <button
                onClick={() => setSelectedDay(null)}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
export default WidokHarmonogramu;
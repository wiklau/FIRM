import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Harmonogram = () => {
  const [workdays, setWorkdays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [manualDateChange, setManualDateChange] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWorkdays();
    }

    const interval = setInterval(() => {
      if (!manualDateChange) {
        setCurrentDate(new Date());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [manualDateChange]);

  const fetchWorkdays = async () => {
    try {
      const response = await axios.get('https://localhost:7039/api/Workday/user/workdays', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWorkdays(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania dni roboczych:', error);
    }
  };

  const startWork = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }

    try {
      await axios.post(
        'https://localhost:7039/api/workday/start',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsWorking(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopWork = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Brak tokena. Użytkownik musi być zalogowany.');
      return;
    }

    try {
      await axios.post(
        'https://localhost:7039/api/workday/stop',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsWorking(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDayOfWeek = (date) => {
    const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
    return daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

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
      const day = new Date(displayDate.getFullYear(), displayDate.getMonth(), i);
      const formattedDate = formatDate(day);

      const dayWork = workdays.find(workday => {
        const startDate = new Date(workday.startTime.split('T')[0]);
        const endDate = new Date(workday.endTime.split('T')[0]);
        return (
          formattedDate === workday.startTime.split('T')[0] ||
          (day >= startDate && day <= endDate)
        );
      });

      days.push({
        number: i,
        type: dayWork ? (dayWork.absence ? 'absence' : 'working') : 'default'
      });
    }

    setDaysInMonth(days);
  };

  useEffect(() => {
    generateDaysInMonth();
  }, [displayDate, workdays]);

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

  const handleDayClick = async (day) => {
    if (!day) return;
  
    const selectedDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day, 0, 0, 0, 0);
    const formattedDate = formatDate(selectedDate);
  
    const dayStatus = workdays.find(workday => {
      const startDate = new Date(workday.startTime.split('T')[0]);
      const endDate = new Date(workday.endTime.split('T')[0]);
      
      return (
        formattedDate === workday.startTime.split('T')[0] ||
        (selectedDate >= startDate && selectedDate <= endDate)
      );
    });
  
    console.log("Selected Date:", formattedDate);
    console.log("Day Status:", dayStatus);
  
    if (dayStatus) {
      if (dayStatus.absence && dayStatus.absence.trim() !== "") {
        setSelectedDay({
          date: formattedDate,
          dayOfWeek: formatDayOfWeek(selectedDate),
          absence: dayStatus.absence,
        });
      } else {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://localhost:7039/api/Workday/user/day/info/${formattedDate}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          const workdayDetails = response.data;
    
          setSelectedDay({
            date: formattedDate,
            dayOfWeek: formatDayOfWeek(selectedDate),
            workdayDetails: workdayDetails.workdayDetails,
            totalWorkedHours: workdayDetails.totalWorkedHours,
            absence: null,
          });
        } catch (error) {
          console.error("Błąd podczas pobierania danych dnia roboczego:", error);
          setSelectedDay({
            date: formattedDate,
            dayOfWeek: formatDayOfWeek(selectedDate),
            absence: "Błąd pobierania danych",
          });
        } finally {
          setLoading(false);
        }
      }
    } else {
      setSelectedDay({
        date: formattedDate,
        dayOfWeek: formatDayOfWeek(selectedDate),
        absence: "Brak danych o tym dniu",
      });
    }    
  };
  

  return (
    <div className='p-10 ml-11'>
      <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-md mb-6">
        <h1 className="text-white text-4xl font-semibold">Harmonogram</h1>
      </div>
      
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">
          <p>{formatDate(currentDate)} - {formatDayOfWeek(currentDate)}</p>
          <p>{formatTime(currentDate)}</p>
        </div>
        <button
          className={`py-2 px-4 rounded text-white ${isWorking ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}`}
          onClick={isWorking ? stopWork : startWork}
        >
          {isWorking ? 'Zakończ pracę' : 'Rozpocznij pracę'}
        </button>
      </div>
      <div className="flex gap-6">
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => changeMonth('previous')}>
              Poprzedni miesiąc
            </button>
            <h2 className="text-2xl font-bold">{formatMonth(displayDate.getMonth())} {displayDate.getFullYear()}</h2>
            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => changeMonth('next')}>
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
                  ${day && day.type === 'working' ? 'bg-green-500' : ''} 
                  ${day && day.type === 'absence' ? 'bg-red-500' : ''} 
                  hover:bg-gray-300 transition duration-150 ease-in-out`}
                onClick={() => handleDayClick(day?.number)}
              >
                {day?.number || ''}
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 bg-gray-100 p-4 rounded-lg h-[350px]">
          {loading ? (
            <p className="text-center text-blue-500">Ładowanie danych...</p>
          ) : selectedDay ? (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">
                Szczegóły dnia {selectedDay.date} ({selectedDay.dayOfWeek})
              </h2>
              {selectedDay.absence && selectedDay.absence.trim() !== "" ? (
                <p>{selectedDay.absence}</p>
              ) : selectedDay.workdayDetails && selectedDay.workdayDetails.length > 0 ? (
                selectedDay.workdayDetails.map((detail, index) => {
                  const formattedStartTime = new Date(detail.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const formattedEndTime = new Date(detail.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const workedHours = new Date(`1970-01-01T${detail.workedHours}Z`)
                    .toISOString()
                    .substr(11, 8);

                  return (
                    <div key={index} className="mb-2">
                      <p><strong>Start:</strong> {formattedStartTime}</p>
                      <p><strong>Koniec:</strong> {formattedEndTime}</p>
                      <p><strong>Przepracowane godziny:</strong> {workedHours}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Brak danych o tym dniu.</p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">Wybierz dzień, aby zobaczyć szczegóły.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Harmonogram;

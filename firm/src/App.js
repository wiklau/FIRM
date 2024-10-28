import 'tailwindcss/tailwind.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PanelAdministratora from './components/PanelAdministratora';
import ZarzadzanieProduktami from './components/ZarzadzanieProduktami';
import Transakcje from './components/Transakcje';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Wydatki from './components/Wydatki';
import Raporty from './components/Raporty';
import Login from './components/Login';
import Harmonogram from './components/Harmonogram';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  return (
    <Router>
      <div className="">
        {token && <NavBar setToken={setToken} />}
        <div className="flex w-screen">
          {token && (
            <div className="w-17/100 bg-gray-200">
              <Sidebar userRole={userRole} />
            </div>
          )}
          <div className="w-3/4">
            <Routes>
              {/* Przekierowanie na stronę logowania, jeśli token jest pusty */}
              <Route path="/" element={token ? <Navigate to="/transakcje" /> : <Navigate to="/login" />} />
              
              {/* Strona logowania */}
              <Route path="/login" element={token ? <Navigate to="/transakcje" /> : <Login setToken={setToken} />} />
              
              {/* Chronione ścieżki */}
              <Route path="/transakcje" element={token ? <Transakcje /> : <Navigate to="/login" />} />
              <Route path="/panel" element={token ? <PanelAdministratora /> : <Navigate to="/login" />} />
              <Route path="/produkty" element={token ? <ZarzadzanieProduktami /> : <Navigate to="/login" />} />
              <Route path="/wydatki" element={token ? <Wydatki /> : <Navigate to="/login" />} />
              <Route path="/raporty" element={token ? <Raporty /> : <Navigate to="/login" />} />
              <Route path="/harmonogram" element={token ? <Harmonogram /> : <Navigate to="/login" />} />
              
              {/* Przekierowanie dla nieznanych ścieżek */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

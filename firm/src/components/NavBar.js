import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profilIcon from "../icons/profil.png";
import axios from 'axios';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('https://firmtracker-server.onrender.com/api/user/role', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response) {
          setUserRole(response.data);
        } else {
          console.error('Nie udało się pobrać roli użytkownika');
        }
      } catch (error) {
        alert('Błąd podczas pobierania roli użytkownika');
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="flex items-center justify-between bg-gray-300 p-7 h-16 top-0 relative">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <Link to="/" className="text-2xl font-customFont font-bold tracking-wide">FIRMTRACKER</Link>
      </div>
      <div className="relative flex items-center">
        <img
          src={profilIcon}
          alt="Profil"
          className="w-8 h-8 mr-2 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md"
          >
            <div className="px-4 py-2 border-b text-sm text-gray-700">
              <span>Rola: {userRole || 'Ładowanie...'}</span>
            </div>
            <button
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 focus:outline-none"
              onClick={handleLogout}
            >
              Wyloguj się
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
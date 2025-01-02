import React from 'react';
import { Link } from 'react-router-dom';
import adminIcon from "../icons/panel.png";
import produktIcon from "../icons/produkty.png";
import transakcjeIcon from "../icons/transkacje.png";
import harmonogramIcon from "../icons/harmonogram.png";
import wydatkiIcon from "../icons/wydatki.png";
import raportyIcon from "../icons/raport.png";

const Sidebar = ({ userRole }) => {
    return (
        <div className="bg-gray-200 h-screen flex-grow justify-center w-max sticky top-0 z-0">
          <ul>
            {userRole !== 'User' && (
                <>
                  <Link to="/panel" className="text-black px-10 py-2 block font-customFont text-center w-full hover:bg-gray-300 transition duration-100">
                      <li className='flex items-center'>
                      <img src={adminIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                      Panel administratora
                  </li></Link>
                </>
            )}
            <Link to="/produkty" className="text-black px-10 py-2 block font-customFont text-center w-full hover:bg-gray-300 transition duration-100 ">
                <li className='flex items-center'>
                <img src={produktIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Produkty
            </li></Link>
            <Link to="/transakcje" className="text-black px-10 py-2 block font-customFont text-center w-full hover:bg-gray-300 transition duration-100 ">
                <li className='flex items-center'>
                <img src={transakcjeIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Transakcje
            </li></Link>
            <Link to="/harmonogram" className="text-black px-10 py-2 block font-customFont text-center w-full flex-item-center hover:bg-gray-300 transition duration-100 ">
                <li className='flex items-center'>
                <img src={harmonogramIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Harmonogram
            </li></Link>
            {userRole !== 'User' && (
              <>
                <Link to="/wydatki" className="text-black px-10 py-2 block font-customFont text-center w-full flex-item-center hover:bg-gray-300 transition duration-100">
                    <li className='flex items-center'>
                    <img src={wydatkiIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                    Wydatki
                </li></Link>
                <Link to="/raporty" className="text-black px-10 py-2 block font-customFont text-center w-full flex-item-center hover:bg-gray-300 transition duration-100">
                    <li className='flex items-center'>
                    <img src={raportyIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                    Raporty
                </li></Link>
              </>
            )}
          </ul>
        </div>
    );
}

export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import adminIcon from "../icons/panel.png";
import produktIcon from "../icons/produkty.png";
import transakcjeIcon from "../icons/transkacje.png";
import harmonogramIcon from "../icons/harmonogram.png";

const Sidebar = () => {
    return (
        <div className="bg-gray-200 h-screen flex justify-center marign-0 w-max">
          <ul className="">
            <Link to="/panel" className="text-black hover:bg-gray-450 px-10 py-2 block font-customFont text-center w-max hover:bg-gray-500">
                <li className='flex items-center'>
                <img src={adminIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Panel Administratora
            </li></Link>
            <Link to="/produkty" className="text-black hover:bg-gray-450 px-10 py-2 block font-customFont text-center w-max hover:bg-gray-500">
                <li className='flex items-center'>
                <img src={produktIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Zarządzanie Produkatami
            </li></Link>
            <Link to="/transakcje" className="text-black hover:bg-gray-450 px-10 py-2 block font-customFont text-center w-max hover:bg-gray-500">
                <li className='flex items-center'>
                <img src={transakcjeIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Transakcje
            </li></Link>
            <Link to="/harmonogram" className="text-black hover:bg-gray-450 px-10 py-2 block font-customFont text-center w-max hover:bg-gray-500 flex-item-center">
                <li className='flex items-center'>
                <img src={harmonogramIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Harmonogram
            </li></Link>
          </ul>
        </div>
      );
      
}
export default Sidebar;
import React from 'react';
import { Link } from 'react-router-dom';
import adminIcon from "../icons/panel.png";
import produktIcon from "../icons/produkty.png";
import transakcjeIcon from "../icons/transkacje.png";
import harmonogramIcon from "../icons/harmonogram.png";
import wydatkiIcon from "../icons/wydatki.png";
import raportyIcon from "../icons/raport.png";

const Sidebar = () => {
    return (
        <div className="bg-gray-200 h-screen flex justify-center marign-0 w-max">
          <ul className="">
            <Link to="/panel" className="text-black px-10 py-2 block font-customFont text-center w-max">
                <li className='flex items-center'>
                <img src={adminIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Panel Administratora
            </li></Link>
            <Link to="/produkty" className="text-black px-10 py-2 block font-customFont text-center w-max">
                <li className='flex items-center'>
                <img src={produktIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Produkty
            </li></Link>
            <Link to="/transakcje" className="text-black px-10 py-2 block font-customFont text-center w-max">
                <li className='flex items-center'>
                <img src={transakcjeIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Transakcje
            </li></Link>
            <Link to="/harmonogram" className="text-black px-10 py-2 block font-customFont text-center w-max flex-item-center">
                <li className='flex items-center'>
                <img src={harmonogramIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Harmonogram
            </li></Link>
            <Link to="/wydatki" className="text-black px-10 py-2 block font-customFont text-center w-max flex-item-center">
                <li className='flex items-center'>
                <img src={wydatkiIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Wydatki
            </li></Link>
            <Link to="/raporty" className="text-black px-10 py-2 block font-customFont text-center w-max flex-item-center">
                <li className='flex items-center'>
                <img src={raportyIcon} alt="Obrazek 1" className="w-7 h-7 mr-2" />
                Raporty
            </li></Link>
          </ul>
        </div>
      );
      
}
export default Sidebar;
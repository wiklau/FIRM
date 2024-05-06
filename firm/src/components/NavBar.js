import React from 'react';
import { Link } from 'react-router-dom';
import lupaIcon from "../icons/lupa.jpg";
import domIcon from "../icons/dom.png";
import profilIcon from "../icons/profil.png";
import settingsIcon from "../icons/settings.png";
import znakIcon from "../icons/znak.png";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-gray-300 p-7 h-16">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <Link to="/" className="text-2xl font-customFont font-bold tracking-wide">FIRMTRACKER</Link>
      </div>
      <div className="relative flex justify-center w-1/3">
        <input type="text" className="px-4 py-2 rounded-full border border-black focus:outline-none focus:border-indigo-500 w-full" />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <img src={lupaIcon} alt="Lupa" className="w-8 h-8 mr-2" />
        </div>
      </div>
      <div className="flex items-center">
        <Link to="/"><img src={domIcon} alt="" className="w-8 h-8 mr-2" /></Link>
        <Link to="/"><img src={znakIcon} alt="" className="w-8 h-8 mr-2" /></Link>
        <Link to="/"><img src={settingsIcon} alt="" className="w-8 h-8 mr-2" /></Link>
        <Link to="/"><img src={profilIcon} alt="" className="w-8 h-8 mr-2" /></Link>
      </div>
    </div>
  );
}

export default Navbar;

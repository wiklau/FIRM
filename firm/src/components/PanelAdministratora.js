import React, { useState } from 'react';
import settingsIcon from "../icons/settings.png";
import editIcon from "../icons/edit.png";
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";

const PanelAdministratora = () => {
  const [selectedOption, setSelectedOption] = useState('raporty');

  return (
    <div className='p-10 ml-11'>
      <div className='h-20 text-2xl'>
        Panel Administratora
      </div>
      
      <div className='flex h-20'>
        <div className="mr-10 text-lg flex">
          <div>
            <button onClick={() => setSelectedOption('raporty')} className={selectedOption === 'raporty' ? 'text-blue-500 font-bold' : ''}>Raporty</button>
          </div>
          <div className='px-10'>
            <button onClick={() => setSelectedOption('pracownicy')} className={selectedOption === 'pracownicy' ? 'text-blue-500 font-bold' : ''}>Pracownicy</button>
          </div>
        </div>
        <div className="ml-auto mr-20">
          <button><img src={settingsIcon} alt="" className="w-8 h-8 mr-2" /></button>
        </div>
      </div>

      {selectedOption === 'raporty' && (
        <div className="flex justify-between">
          <div className="flex flex-col w-1/3">
            <div className="w-80 h-80 bg-gray-300 mt-3 mb-11 justify-center items-center">
              <div className="text-center mt-7 font-customFont">Przychody - mies.</div>
              <div className="text-5xl font-bold font-customFont text-center mt-20 text-green-600">1000 zł</div>
            </div>
            <div className="w-80 h-80 bg-gray-300"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" /></div>
          </div>
          <div className="flex flex-col w-1/3">
            <div className="w-80 h-80 bg-gray-300 mt-3 mb-11 justify-center items-center">
              <div className="text-center mt-7 font-customFont">Wydatki - mies.</div>
              <div className="text-5xl font-bold font-customFont text-center mt-20 text-red-600">1000 zł</div>
            </div>
            <div className="w-80 h-80 bg-gray-300"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" /></div>
          </div>
          <div className="flex flex-col w-1/3">
            <div className="w-80 h-80 bg-gray-300 mt-3 mb-11 justify-center items-center">
              <div className="text-center mt-7 font-customFont">Zyski - mies.</div>
              <div className="text-5xl font-bold text-center mt-20 font-customFont text-blue-600">1000 zł</div>
            </div>
            <div className="w-80 h-80 bg-gray-300"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" /></div>
          </div>
        </div>  
      )}

      {selectedOption === 'pracownicy' && (
        <div>
          <div className="h-64 overflow-y-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2">Nazwisko</th>
                  <th className="border border-gray-300 p-2">Imię</th>
                  <th className="border border-gray-300 p-2">Stanowisko</th>
                  <th className="border border-gray-300 p-2">Godz.Wejścia</th>
                  <th className="border border-gray-300 p-2">Godz.Wyjścia</th>
                  <th className="border border-gray-300 p-2">Nr. Pracownika</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                  <td className="border border-gray-300 p-2">Smith</td>
                  <td className="border border-gray-300 p-2">John</td>
                  <td className="border border-gray-300 p-2">Programista</td>
                  <td className="border border-gray-300 p-2">08:00</td>
                  <td className="border border-gray-300 p-2">16:00</td>
                  <td className="border border-gray-300 p-2">12345</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-start mt-4">
            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex"><img src={editIcon} alt="" className="w-8 h-8 mr-2" />Edytuj</button>
            <button className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex"><img src={koszIcon} alt="" className="w-8 h-8 mr-2" />Usuń</button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdministratora;

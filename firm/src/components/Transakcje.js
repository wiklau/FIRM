import React from 'react';
import editIcon from "../icons/edit.png";
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";
import lupaIcon from "../icons/lupa.jpg";

const Transakcje = () => {
  return (
    <div className='p-10 ml-11'>
      <div className='flex items-center justify-between'>
        <div className='h-20 text-5xl ml-1'>
          Lista Transakcji
        </div>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj</button>
      </div>
      <div>
        <div className="relative flex justify-center w-1/3 mt-17">
          <input type="text" className="px-4 py-2 rounded-full border border-black focus:outline-none focus:border-indigo-500 w-full" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <img src={lupaIcon} alt="Lupa" className="w-8 h-8 mr-2" />
          </div>
        </div>
      </div>
      <div className="w-8/10 mx-auto mt-2">
        <div className="h-64 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2"></th>
                <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Data</th>
                  <th className="border border-gray-300 p-2">Godzina</th>
                  <th className="border border-gray-300 p-2">Produkt</th>
                  <th className="border border-gray-300 p-2">Ilość</th>
                  <th className="border border-gray-300 p-2">Kwota</th>
                  <th className="border border-gray-300 p-2">Sposób płatności</th>
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
        </div>
      </div>
    </div>
  );
}

export default Transakcje;

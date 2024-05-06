import React from 'react';
import editIcon from "../icons/edit.png";
import koszIcon from "../icons/kosz.png";
import plusIcon from "../icons/plus.png";

const ZarzadzanieProduktami = () => {
  return (
    <div className='p-10 ml-11'>
      <div className='flex items-center justify-between'>
        <div className='h-20 text-5xl ml-1'>
          Katalog Produktów
        </div>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex"><img src={plusIcon} alt="" className="w-8 h-8 mr-2" />Dodaj</button>
      </div>
      <div>
      </div>
      <div className="w-8/10 mx-auto mt-2">
        <div className="h-64 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2"></th>
                <th className="border border-gray-300 p-2">Produkt</th>
                  <th className="border border-gray-300 p-2">Dostępność</th>
                  <th className="border border-gray-300 p-2">Cena</th>
                  <th className="border border-gray-300 p-2">Kategoria</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2"><input type="checkbox" /></td>
                <td className="border border-gray-300 p-2">Produkt</td>
                <td className="border border-gray-300 p-2">Dostępność</td>
                <td className="border border-gray-300 p-2">Cena</td>
                <td className="border border-gray-300 p-2">Kategoria</td>
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

export default ZarzadzanieProduktami;

import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ListaProduktow from './ListaProduktów';
import DodawanieProduktu from './DodawanieProduktów';
import EdycjaProduktu from './EdycjaProduktu';

const ZarzadzanieProduktami = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 ml-11">
      <Routes>
        <Route
          path="/"
          element={<ListaProduktow onAdd={() => navigate('/produkty/dodaj')} onEdit={(id) => navigate(`/produkty/edytuj/${id}`)} />}
        />
        <Route path="/dodaj" element={<DodawanieProduktu />} />
        <Route path="/edytuj/:id" element={<EdycjaProduktu />} />
      </Routes>
    </div>
  );
};

export default ZarzadzanieProduktami;

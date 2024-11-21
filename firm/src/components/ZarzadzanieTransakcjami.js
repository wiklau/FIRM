import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ListaTransakcji from './ListaTransakcji';
import DodawanieTransakcji from './DodawanieTransakcji';
import EdycjaTransakcji from './EdycjaTransakcji';

const ZarzadzanieTransakcjami = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 ml-11">
      <Routes>
        <Route
          path="/"
          element={<ListaTransakcji onAdd={() => navigate('/transakcje/dodaj')} onEdit={(id) => navigate(`/transakcje/edytuj/${id}`)} />}
        />
        <Route path="/dodaj" element={<DodawanieTransakcji />} />
        <Route path="/edytuj/:id" element={<EdycjaTransakcji />} />
      </Routes>
    </div>
  );
};

export default ZarzadzanieTransakcjami;

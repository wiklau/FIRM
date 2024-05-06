import 'tailwindcss/tailwind.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PanelAdministratora from './components/PanelAdministratora';
import ZarzadzanieProduktami from './components/ZarzadzanieProduktami';
import Transakcje from './components/Transakcje';
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <Router>
      <div className="">
          <NavBar />
          <div className="flex w-screen">
            <div className="w-17/100">
              <Sidebar />
            </div>
          <div className="w-3/4">
            <Routes>
              <Route path="/transakcje" element={<Transakcje />} />
              <Route path="/panel" element={<PanelAdministratora />} />
              <Route path="/produkty" element={<ZarzadzanieProduktami />} />
            </Routes>
          </div>
        </div>
      </div>
      </Router>
  );
}

export default App;

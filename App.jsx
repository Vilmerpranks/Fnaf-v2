import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MonitorPage } from './pages/MonitorPage';
import { CameraPage } from './pages/CameraPage';
import { HomePage } from './pages/HomePage';
import { CRTOverlay } from './components/CRTOverlay';

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-black text-[#33ff00] font-mono relative overflow-hidden select-none crt-flicker">
        <CRTOverlay />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/camera" element={<CameraPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
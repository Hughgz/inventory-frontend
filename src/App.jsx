import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Enterprise from './pages/Enterprise';
import ImportReceipt from './pages/ImportReceipt';
import ExportReceipt from './pages/ExportReceipt';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/enterprise" element={<Enterprise />} />
        <Route exact path="/warehouse/import-receipt" element={<ImportReceipt />} />
        <Route exact path="/warehouse/export-receipt" element={<ExportReceipt />} />

      </Routes>
    </>
  );
}

export default App;

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
import InventoryTable from './pages/InventoryTable';
import CustomerManagement from './pages/CustomerManagement';
import Login from './pages/Login';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import { setupAxiosInterceptors } from './api/authApi';

// Initialize axios interceptors
setupAxiosInterceptors();

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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enterprise" 
          element={
            <ProtectedRoute>
              <Enterprise />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/warehouse/import-receipt" 
          element={
            <ProtectedRoute>
              <ImportReceipt />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/warehouse/export-receipt" 
          element={
            <ProtectedRoute>
              <ExportReceipt />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/warehouse/summary" 
          element={
            <ProtectedRoute>
              <InventoryTable />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/catalogs/customers" 
          element={
            <ProtectedRoute>
              <CustomerManagement />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;

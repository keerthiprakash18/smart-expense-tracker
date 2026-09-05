import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { getAccessToken } from './services/api';

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
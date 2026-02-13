import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthLayout, ProtectedRoute } from './components/layout';
import {
  Landing,
  Login,
  Register,
  Dashboard,
  Records,
  AddRecord,
  Upload,
  Reports,
  ERL
} from './pages';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  // Initialize theme listener
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with auth layout */}
        <Route
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/add" element={<AddRecord />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/erl" element={<ERL />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

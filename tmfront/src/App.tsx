import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthLayout, ProtectedRoute } from './components/layout';
import { useTheme } from './hooks/useTheme';

// Lazy load pages
const Landing = React.lazy(() => import('./pages').then(module => ({ default: module.Landing })));
const Login = React.lazy(() => import('./pages').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('./pages').then(module => ({ default: module.Register })));
const Dashboard = React.lazy(() => import('./pages').then(module => ({ default: module.Dashboard })));
const Records = React.lazy(() => import('./pages').then(module => ({ default: module.Records })));
const AddRecord = React.lazy(() => import('./pages').then(module => ({ default: module.AddRecord })));
const Upload = React.lazy(() => import('./pages').then(module => ({ default: module.Upload })));
const Reports = React.lazy(() => import('./pages').then(module => ({ default: module.Reports })));
const ERL = React.lazy(() => import('./pages').then(module => ({ default: module.ERL })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

const App: React.FC = () => {
  // Initialize theme listener
  useTheme();

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

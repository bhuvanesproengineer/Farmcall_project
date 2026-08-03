import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';

// Public Pages
import Home from './pages/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import AiAdvisory from './pages/AiAdvisory/AiAdvisory';
import AutomationBroadcast from './pages/AutomationBroadcast/AutomationBroadcast';
import SmsFallback from './pages/SmsFallback/SmsFallback';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

// Dashboard Layout & Pages
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import TestCall from './pages/TestCall';
import Broadcast from './pages/Broadcast';
import Automation from './pages/Automation';
import CallLogs from './pages/CallLogs';

function PublicLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" style={{ paddingTop: '88px' }}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-advisory" element={<AiAdvisory />} />
          <Route path="/automation-broadcast" element={<AutomationBroadcast />} />
          <Route path="/sms-fallback" element={<SmsFallback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected SaaS Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/test-call" element={<TestCall />} />
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/call-logs" element={<CallLogs />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;


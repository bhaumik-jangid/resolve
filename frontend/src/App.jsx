import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { AppLayout } from './layouts/AppLayout';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { AgentDashboard } from './pages/dashboard/AgentDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TicketsPage } from './pages/dashboard/TicketsPage';

import { ChatPage } from './pages/dashboard/ChatPage';

// Placeholder Pages (we will build these next)
const DashboardRedirect = () => {
  // Simple mock redirect based on generic user (role logic handled inside dashboards effectively via rendering specific ones if we wanted strictly separate routes, but here we share layout)
  // For simplicity in this demo, defaulting to customer view or generic overview
  return <Navigate to="/dashboard/overview" replace />;
};

const Placeholder = ({ title }) => <div className="p-8 text-brand-light font-medium text-lg opacity-50">Coming Soon: {title}</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/signup" element={<Navigate to="/auth" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<AppLayout />}>
            <Route index element={<DashboardRedirect />} />
            <Route path="overview" element={<CustomerDashboard />} /> {/* Using Customer view as default for demo */}
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<Placeholder title="User Profile" />} />
            <Route path="agents" element={<AdminDashboard />} /> {/* Admin view demo */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

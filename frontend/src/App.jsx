import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { AppLayout } from './layouts/AppLayout';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { AgentDashboard } from './pages/dashboard/AgentDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TicketsPage } from './pages/dashboard/TicketsPage';
import { ChatPage } from './pages/dashboard/ChatPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { TicketsProvider } from './context/TicketsContext';

// Dashboard Redirect based on Role
const DashboardRedirect = () => {
  const { user } = useAuth();
  // Redirect to "Overview" for all by default, but this could be customized
  // e.g., Agents might go straight to tickets
  return <Navigate to="/dashboard/overview" replace />;
};

const Placeholder = ({ title }) => <div className="p-8 text-brand-light font-medium text-lg opacity-50">Coming Soon: {title}</div>;

import { useAuth } from './context/AuthContext';

// Smart Container for Dashboard Overview
const DashboardOverview = () => {
  const { user } = useAuth();
  if (!user) return null;
  console.log("Dashboard loaded for role:", user.role);
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'agent') return <AgentDashboard />;
  return <CustomerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <TicketsProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<AppLayout />}>
              <Route index element={<DashboardRedirect />} />
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* Role Specific Routes if needed directly */}
              <Route path="agents" element={<AdminDashboard />} />
              {/* <Route path="system" element={<AdminSystem />} /> */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </TicketsProvider>
    </AuthProvider>
  );
}

export default App;

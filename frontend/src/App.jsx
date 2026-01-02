import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthPage } from './pages/AuthPage';
import { AppLayout } from './layouts/AppLayout';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { AgentDashboard } from './pages/dashboard/AgentDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TicketsPage } from './pages/dashboard/TicketsPage';
import { ChatPage } from './pages/dashboard/ChatPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { TicketsProvider } from './context/TicketsContext';
import { useAuth } from './context/AuthContext';

// Dashboard Redirect based on Role
const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate to="/dashboard/overview" replace />;
};


// Smart Container for Dashboard Overview
const DashboardOverview = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'agent') return <AgentDashboard />;
  return <CustomerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

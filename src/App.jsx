import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { InsightsPage } from './pages/InsightsPage'
import { UsersPage } from './pages/UsersPage'
import { AppLayout } from './components/AppLayout'
import { Navigation } from './components/Navigation'
import './App.css'

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App

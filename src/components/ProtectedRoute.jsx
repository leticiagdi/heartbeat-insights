import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../pages/LoginPage';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

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

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container">
        <div className="card">
          <p>Acesso negado. Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  return children;
}

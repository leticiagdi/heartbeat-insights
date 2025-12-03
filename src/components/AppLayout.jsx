import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

export function AppLayout({ children }) {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const goToUsers = () => {
    navigate('/usuarios');
  };

  return (
    <div className="container">
      <div className="user-info-bar">
        {currentUser && (
          <div className="user-info">
            <span>{currentUser.name}</span>
            <span className={`role ${currentUser.role}`}>{currentUser.role}</span>
            {isAdmin && (
              <button onClick={goToUsers} className="btn-secondary">
                Usuários
              </button>
            )}
            <button onClick={logout} className="btn-logout">
              Sair
            </button>
          </div>
        )}
      </div>
      <header className="app-header">
        <h1>Heartbeat Insights</h1>
        <p>Plataforma de Análise Cardiovascular</p>
      </header>

      {children}
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles/global.css';

export function AppLayout({ children }) {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState(null);
  const [showAdviceMessage, setShowAdviceMessage] = useState(false);

  const goToUsers = () => {
    navigate('/usuarios');
  };

  const fetchAdvice = async () => {
    const result = await api.get('/analytics/health-advice');
    if (result.ok) {
      setAdvice(result.data.advice);
      setShowAdviceMessage(true);
    }
  };

  return (
    <div className="container">
      <div className="user-info-bar">
        <div className="advice-banner">
          <button onClick={fetchAdvice} className="btn-advice">
            💡 Receber Conselho
          </button>
        </div>
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

      {showAdviceMessage && advice && (
        <div className="advice-message">
          <span className="advice-icon">💡</span>
          <p>{advice}</p>
        </div>
      )}

      <header className="app-header">
        <h1>Heartbeat Insights</h1>
        <p>Plataforma de Análise Cardiovascular</p>
      </header>

      {children}
    </div>
  );
}

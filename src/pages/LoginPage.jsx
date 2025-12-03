import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import '../styles/login.css';

export function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'register'
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await api.post('/auth/login', { email, password });

    if (result.ok) {
      login(result.data, result.data.token);
      showMessage('Login realizado com sucesso!', 'success');
      onLoginSuccess?.();
    } else {
      showMessage(result.error || 'Erro no login', 'error');
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    const result = await api.post('/auth/register', { name, email, password, role });

    if (result.ok) {
      showMessage('Usuário criado com sucesso! Faça login.', 'success');
      setActiveTab('login');
      e.target.reset();
    } else {
      showMessage(result.error || 'Erro no registro', 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h1>Heartbeat Insights</h1>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registro
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="form">
            <h2>Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
            />
            <button type="submit" className="btn-primary">
              Entrar
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="form">
            <h2>Registro</h2>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
            />
            <select name="role" defaultValue="user">
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn-secondary">
              Registrar
            </button>
          </form>
        )}

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

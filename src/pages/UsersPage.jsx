import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import '../styles/users.css';

export function UsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await api.get('/auth/users');

    if (result.ok) {
      setUsers(result.data.users || []);
      setError('');
    } else {
      if (result.status === 403) {
        setError('Acesso negado. Apenas administradores podem ver esta lista.');
      } else if (result.status === 401) {
        setError('Token inválido ou expirado. Faça login novamente.');
      } else {
        setError('Erro ao carregar usuários');
      }
      setUsers([]);
    }

    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <section className="section">
          <div className="card">
            <p>Acesso negado. Apenas administradores podem acessar esta página.</p>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <section className="section">
          <div className="card">
            <p>Carregando usuários...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 0, width: '100%' }}>
      <section className="section">
        <div className="card">
          <h2>Usuários</h2>
          
          {error && <div className="message error">{error}</div>}

          {users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <div className="users-list-grid">
              {users.map((user) => (
                <div key={user._id} className="user-item">
                  <h4>{user.name || '(sem nome)'}</h4>
                  <p>
                    <strong>Email:</strong> {user.email || ''}
                  </p>
                  <p>
                    <strong>Role:</strong>{' '}
                    <span className={`role ${user.role || ''}`}>
                      {user.role || ''}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

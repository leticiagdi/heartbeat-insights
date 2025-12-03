import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import '../styles/users.css';

export function UsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user'
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    const result = await api.put(`/auth/users/${editingUser._id}`, formData);

    if (result.ok) {
      setShowEditModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'user' });
      loadUsers();
    } else {
      alert(result.error || 'Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) return;

    const result = await api.delete(`/auth/users/${userId}`);

    if (result.ok) {
      loadUsers();
    } else {
      alert(result.error || 'Erro ao excluir usuário');
    }
  };

  if (!isAdmin) {
    return (
      <div className="section">
        <div className="card">
          <p>Acesso negado. Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section">
        <div className="card">
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="card">
        <h2>👥 Usuários</h2>
          
          {error && <div className="message error">{error}</div>}

          {users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <div className="users-list">
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
                  <div className="user-actions">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="btn-secondary"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="btn-danger"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        {showEditModal && editingUser && (
          <div className="modal show">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
              >
                &times;
              </span>
              <h3>Editar Usuário</h3>
              <form onSubmit={handleUpdateUser} className="form">
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="modal-buttons">
                  <button type="submit" className="btn-primary">
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

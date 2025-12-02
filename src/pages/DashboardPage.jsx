import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import '../styles/dashboard.css';

export function DashboardPage() {
  const { isAdmin, authToken } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    data: ''
  });

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    const result = await api.get('/analytics/dashboard');

    if (result.ok) {
      setDashboards(result.data.dashboards || []);
      setError('');
    } else {
      setError(result.error || 'Erro ao carregar dashboards');
      setDashboards([]);
    }

    setLoading(false);
  };

  const handleCreateDashboard = async (e) => {
    e.preventDefault();

    try {
      const data = JSON.parse(formData.data);
      const result = await api.post('/analytics/dashboard', {
        title: formData.title,
        description: formData.description,
        data
      });

      if (result.ok) {
        setShowCreateModal(false);
        setFormData({ title: '', description: '', data: '' });
        loadDashboards();
      } else {
        alert(result.error || 'Erro ao criar dashboard');
      }
    } catch (err) {
      alert('JSON inválido: ' + err.message);
    }
  };

  const handleDeleteDashboard = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este dashboard?')) return;

    const result = await api.delete(`/analytics/dashboard/${id}`);

    if (result.ok) {
      loadDashboards();
    } else {
      alert(result.error || 'Erro ao excluir dashboard');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="section">
      <div className="card">
        <h2>🫀 Dashboards</h2>

        {isAdmin && (
          <div className="dashboard-options">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              + Criar Dashboard
            </button>
          </div>
        )}

        {error && <div className="message error">{error}</div>}

        {dashboards.length === 0 ? (
          <p>Nenhum dashboard encontrado.</p>
        ) : (
          <div className="dashboards-list">
            {dashboards.map((dashboard) => (
              <div key={dashboard._id} className="dashboard-item">
                <div className="dashboard-header">
                  <h4>{dashboard.title}</h4>
                </div>
                <p>{dashboard.description}</p>
                <small>
                  Criado: {new Date(dashboard.createdAt).toLocaleDateString('pt-BR')}
                </small>
                {isAdmin && (
                  <div className="dashboard-actions">
                    <button
                      onClick={() => handleDeleteDashboard(dashboard._id)}
                      className="btn-danger"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criar Dashboard */}
        {showCreateModal && (
          <div className="modal show">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </span>
              <h3>Criar Dashboard</h3>
              <form onSubmit={handleCreateDashboard} className="form">
                <input
                  type="text"
                  placeholder="Título"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder={'JSON válido:\n{"campo": "valor"}'}
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  required
                  rows="8"
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn-primary">
                    Criar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { ChartModal } from '../components/ChartModal';
import { chartExamples } from '../utils/chartExamples';
import '../styles/dashboard.css';

export function DashboardPage() {
  const { isAdmin, authToken } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(null);
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

  const handleFillExample = (chartType) => {
    const example = chartExamples[chartType];
    setFormData({
      title: example.title,
      description: `Exemplo de gráfico ${chartType}`,
      data: JSON.stringify(example, null, 2)
    });
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
          <>
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
                  <div className="dashboard-actions">
                    {dashboard.data && (
                      <button
                        onClick={() => setShowChartModal(dashboard)}
                        className="btn-secondary"
                      >
                        📊 Ver Gráfico
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteDashboard(dashboard._id)}
                        className="btn-danger"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showChartModal && (
          <ChartModal 
            dashboard={showChartModal} 
            onClose={() => setShowChartModal(null)} 
          />
        )}

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
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                  <strong>Exemplos rápidos:</strong>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => handleFillExample('pie')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      📊 Pizza
                    </button>
                    <button type="button" onClick={() => handleFillExample('doughnut')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      🍩 Donut
                    </button>
                    <button type="button" onClick={() => handleFillExample('bar')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      📈 Barra
                    </button>
                    <button type="button" onClick={() => handleFillExample('line')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      📉 Linha
                    </button>
                    <button type="button" onClick={() => handleFillExample('scatter')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      🔵 Dispersão
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder={'JSON válido:\n{"type":"pie","title":"...","labels":[...],"data":[...]}'}
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  required
                  rows="10"
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

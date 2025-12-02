import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { InsightsSkeleton } from '../components/SkeletonLoader';
import '../styles/insights.css';

export function InsightsPage() {
  const { isAdmin } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'medium'
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    const result = await api.get('/analytics/insights');

    if (result.ok) {
      setInsights(result.data.insights || []);
      setError('');
    } else {
      setError(result.error || 'Erro ao carregar insights');
      setInsights([]);
    }

    setLoading(false);
  };

  const handleCreateInsight = async (e) => {
    e.preventDefault();

    const result = await api.post('/analytics/insights', formData);

    if (result.ok) {
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        type: 'info',
        priority: 'medium'
      });
      loadInsights();
    } else {
      alert(result.error || 'Erro ao criar insight');
    }
  };

  if (loading) {
    return <InsightsSkeleton />;
  }

  return (
    <div className="section">
      <div className="card">
        <h2>Insights & Action Items</h2>

        {isAdmin && (
          <div className="insights-options">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              + Criar Insight
            </button>
          </div>
        )}

        {error && <div className="message error">{error}</div>}

        {insights.length === 0 ? (
          <p>Nenhum insight encontrado.</p>
        ) : (
          <div className="insights-list">
            {insights.map((insight) => (
              <div key={insight._id} className="insight-item">
                <h4 className="insight-title">{insight.title}</h4>
                <p className="insight-content">{insight.content}</p>
                <div className="insight-meta">
                  <span className={`insight-type ${insight.type}`}>
                    {insight.type}
                  </span>
                  <span className={`insight-priority ${insight.priority}`}>
                    {insight.priority}
                  </span>
                </div>
                <small>
                  Criado em: {new Date(insight.createdAt).toLocaleDateString('pt-BR')}
                </small>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criar Insight */}
        {showCreateModal && (
          <div className="modal show">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </span>
              <h3>Criar Insight</h3>
              <form onSubmit={handleCreateInsight} className="form">
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
                  placeholder="Conteúdo do insight"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="info">Informação</option>
                  <option value="action">Ação</option>
                  <option value="warning">Atenção</option>
                  <option value="success">Sucesso</option>
                </select>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
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

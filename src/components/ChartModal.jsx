import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';
import '../styles/chart-modal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export function ChartModal({ dashboard, onClose }) {
  if (!dashboard?.data) return null;

  const chartData = dashboard.data;
  const chartType = chartData.chartType || chartData.type;
  const labels = chartData.labels || [];
  const values = chartData.values || chartData.data || [];

  // Valida se há dados suficientes para exibir o gráfico
  if (!chartType || !values.length) {
    return (
      <div className="chart-modal-overlay" onClick={onClose}>
        <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="chart-modal-header">
            <h3>{dashboard.title}</h3>
            <button className="chart-modal-close" onClick={onClose}>×</button>
          </div>
          <div className="chart-modal-body">
            <p style={{ color: '#999', textAlign: 'center' }}>
              Sem dados para exibir
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normaliza valores do MongoDB que vêm como { $numberInt: "42" }
  const normalizeValue = (val) => {
    if (val?.$numberInt) return parseInt(val.$numberInt, 10);
    return typeof val === 'number' ? val : parseInt(val) || 0;
  };

  // Paleta de cores padrão
  const colors = [
    'rgba(220, 38, 38, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(251, 146, 60, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(14, 165, 233, 0.8)',
  ];

  // Configuração específica para scatter plot
  if (chartType === 'scatter') {
    let scatterDatasets = chartData.datasets;

    // Se não tiver datasets prontos, agrupa por 'group'
    if (!scatterDatasets && Array.isArray(values)) {
      const groupMap = {};

      values.forEach(point => {
        const groupName = point.group || 'Dados';
        if (!groupMap[groupName]) {
          groupMap[groupName] = [];
        }
        groupMap[groupName].push({ x: point.x, y: point.y });
      });

      scatterDatasets = Object.keys(groupMap).map((groupName, index) => ({
        label: groupName,
        data: groupMap[groupName],
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.8', '1'),
      }));
    }

    const config = {
      datasets: scatterDatasets,
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 15, font: { size: 12 } },
        },
      },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'X' } },
        y: { title: { display: true, text: 'Y' } },
      },
    };

    return (
      <div className="chart-modal-overlay" onClick={onClose}>
        <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="chart-modal-header">
            <h3>{chartData.title || dashboard.title}</h3>
            <button className="chart-modal-close" onClick={onClose}>×</button>
          </div>
          <div className="chart-modal-body">
            <Scatter data={config} options={options} />
          </div>
        </div>
      </div>
    );
  }

  const normalizedValues = values.map(v => normalizeValue(v));

  // Configuração do dataset
  const dataset = {
    label: chartData.title || 'Dados',
    data: normalizedValues,
    backgroundColor: chartType === 'pie' || chartType === 'doughnut' ? colors : colors[0],
    borderColor: chartType === 'pie' || chartType === 'doughnut' ? '#fff' : colors[0].replace('0.8', '1'),
    borderWidth: 2,
  };

  // Configurações específicas para gráfico de linha
  if (chartType === 'line') {
    dataset.tension = 0.4;
    dataset.fill = false;
    dataset.pointRadius = 4;
    dataset.pointBackgroundColor = colors[0].replace('0.8', '1');
  }

  // Estrutura de dados do gráfico
  const config = {
    labels,
    datasets: [dataset],
  };

  // Opções gerais do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 },
        },
      },
    },
  };

  // configuração de eixos para gráficos de linha e barra
  if (chartType === 'line' || chartType === 'bar') {
    options.scales = {
      y: {
        beginAtZero: true,
        ticks: { color: 'rgb(107, 114, 128)' },
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
      },
      x: {
        ticks: { color: 'rgb(107, 114, 128)' },
      },
    };
  }

  // Renderiza o gráfico
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return <Pie data={config} options={options} />;
      case 'doughnut':
        return <Doughnut data={config} options={options} />;
      case 'bar':
        return <Bar data={config} options={options} />;
      case 'line':
        return <Line data={config} options={options} />;
      default:
        return <Pie data={config} options={options} />;
    }
  };

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chart-modal-header">
          <h3>{chartData.title || dashboard.title}</h3>
          <button className="chart-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="chart-modal-body">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}

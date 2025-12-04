export const chartExamples = {
  pie: {
    chartType: 'pie',
    title: 'Distribuição por Faixa Etária',
    labels: ['18-30', '31-45', '46-60', '60+'],
    values: [25, 35, 20, 20]
  },
  doughnut: {
    chartType: 'doughnut',
    title: 'Condições Cardiovasculares',
    labels: ['Hipertensão', 'Arritmia', 'Insuficiência Cardíaca', 'Saudável'],
    values: [35, 25, 20, 20]
  },
  bar: {
    chartType: 'bar',
    title: 'Pacientes por Mês',
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    values: [65, 59, 80, 81, 56, 55]
  },
  line: {
    chartType: 'line',
    title: 'Tendência de Pressão Arterial',
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
    values: [120, 135, 128, 142, 125]
  },
  scatter: {
    chartType: 'scatter',
    title: 'Idade vs Frequência Cardíaca',
    values: [
      { x: 45, y: 145, group: 'Grupo A' },
      { x: 52, y: 160, group: 'Grupo A' },
      { x: 38, y: 120, group: 'Grupo B' },
      { x: 41, y: 130, group: 'Grupo B' },
      { x: 55, y: 155, group: 'Grupo A' },
      { x: 35, y: 125, group: 'Grupo B' }
    ]
  }
};

export const kpiExamples = {
  totalDashboards: 5,
  totalInsights: 12,
  totalUsers: 8,
  activeSessions: 3
};

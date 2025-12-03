const DISEASE_API_BASE = 'https://disease.sh/v3/covid-19';

export const getGlobalHealthData = async () => {
  try {
    const response = await fetch(`${DISEASE_API_BASE}/all`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados globais:', error);
    throw new Error('Falha ao buscar dados da API');
  }
};

export const getCountriesHealthData = async () => {
  try {
    const response = await fetch(`${DISEASE_API_BASE}/countries?sort=deaths`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados por país:', error);
    throw new Error('Falha ao buscar dados da API');
  }
};

export const getHistoricalData = async (days = 365) => {
  try {
    const response = await fetch(`${DISEASE_API_BASE}/historical/all?lastdays=${days}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados históricos:', error);
    throw new Error('Falha ao buscar dados da API');
  }
};

export const generateHealthDashboards = async () => {
  const [globalData, countriesData, historicalData] = await Promise.all([
    getGlobalHealthData(),
    getCountriesHealthData(),
    getHistoricalData(180)
  ]);

  const dashboards = [];

  const top10Countries = countriesData.slice(0, 10);
  dashboards.push({
    title: 'Top 10 Países - Mortalidade Total',
    description: 'Países com maior número total de mortes (Dados Reais - Disease.sh API)',
    isExternalData: true,
    dataSource: 'Disease.sh API',
    data: {
      chartType: 'bar',
      title: 'Total de Mortes por País',
      labels: top10Countries.map(c => c.country),
      values: top10Countries.map(c => c.deaths)
    }
  });

  dashboards.push({
    title: 'Taxa de Mortalidade por Milhão',
    description: 'Top 10 países com maior taxa de mortalidade per capita',
    isExternalData: true,
    dataSource: 'Disease.sh API',
    data: {
      chartType: 'bar',
      title: 'Mortes por Milhão de Habitantes',
      labels: countriesData.slice(0, 10).map(c => c.country),
      values: countriesData.slice(0, 10).map(c => c.deathsPerOneMillion)
    }
  });

  const totalCases = globalData.cases;
  const totalDeaths = globalData.deaths;
  const totalRecovered = globalData.recovered;
  const activeCases = globalData.active;

  dashboards.push({
    title: 'Distribuição Global de Casos',
    description: `Dados atualizados: ${new Date(globalData.updated).toLocaleDateString('pt-BR')}`,
    isExternalData: true,
    dataSource: 'Disease.sh API',
    data: {
      chartType: 'pie',
      title: 'Casos Globais',
      labels: ['Recuperados', 'Ativos', 'Mortes'],
      values: [totalRecovered, activeCases, totalDeaths]
    }
  });

  const historicalDates = Object.keys(historicalData.cases);
  const last30Days = historicalDates.slice(-30);
  const casesLast30Days = last30Days.map(date => historicalData.cases[date]);

  dashboards.push({
    title: 'Tendência de Casos - Últimos 30 Dias',
    description: 'Evolução diária do total de casos confirmados',
    isExternalData: true,
    dataSource: 'Disease.sh API',
    data: {
      chartType: 'line',
      title: 'Total de Casos',
      labels: last30Days.map(date => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
      values: casesLast30Days
    }
  });

  return {
    dashboards,
    metadata: {
      source: 'Disease.sh - Open Disease Data API',
      lastUpdated: new Date(globalData.updated).toISOString(),
      affectedCountries: globalData.affectedCountries,
    },
    summary: {
      totalCases: globalData.cases,
      totalDeaths: globalData.deaths,
      totalRecovered: globalData.recovered,
      activeCases: globalData.active,
    }
  };
};

const ADVICE_API_BASE = 'https://api.adviceslip.com';

const healthTerms = ['health', 'heart', 'life', 'care', 'wellness', 'body', 'mind'];

export const getHealthAdvice = async () => {
  try {
    // busca usando uma palavra aleatória da lista
    const randomTerm = healthTerms[Math.floor(Math.random() * healthTerms.length)];
    
    const response = await fetch(`${ADVICE_API_BASE}/advice/search/${randomTerm}`);
    const data = await response.json();

    if (data.slips && data.slips.length > 0) {
      const randomAdvice = data.slips[Math.floor(Math.random() * data.slips.length)];
      return {
        id: randomAdvice.id,
        advice: randomAdvice.advice,
        source: 'Advice Slip API'
      };
    }

    const randomResponse = await fetch(`${ADVICE_API_BASE}/advice`);
    const randomData = await randomResponse.json();
    return {
      id: randomData.slip.id,
      advice: randomData.slip.advice,
      source: 'Advice Slip API'
    };
  } catch (error) {
    console.error('Erro ao buscar conselho:', error);
    return {
      id: 0,
      advice: 'Cuide da sua saúde cardiovascular todos os dias.',
      source: 'Sistema'
    };
  }
};

// Helper para centralizar chamadas à API com suporte a Authorization header

const API_BASE = '/api';

// método genérico para chamadas à API
export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Busca token do localStorage
  const token = localStorage.getItem('authToken');
  
  // Monta headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Adiciona Authorization se token existir
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  // Se houver body, converte para JSON
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));
  
  return {
    status: response.status,
    ok: response.ok,
    data,
    error: !response.ok ? data.message || response.statusText : null
  };
}

export const api = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  
  post: (endpoint, body) => apiCall(endpoint, { method: 'POST', body }),
  
  put: (endpoint, body) => apiCall(endpoint, { method: 'PUT', body }),
  
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' })
};

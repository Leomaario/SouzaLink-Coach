// src/services/api.js

const isProduction = import.meta.env.MODE === 'production';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (isProduction
      ? 'https://api-e-learning-gjnd.onrender.com/api'
      : 'http://localhost:8080/api');

console.log('API_BASE_URL:', API_BASE_URL);

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isAuthEndpoint = endpoint.startsWith('/auth/');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };

  if (token && !isAuthEndpoint) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    console.error("Erro de conexão com o backend:", err);
    throw new Error('Erro de conexão com o servidor. Tente novamente mais tarde.');
  }

  if (response.status === 401 || response.status === 403) {
    let errorMsg = 'Não autorizado';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    let errorMsg = 'Erro ao fazer a requisição';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return response;

  return response;
};

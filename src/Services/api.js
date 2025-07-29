const isProduction = import.meta.env.MODE === 'production';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (isProduction
    ? 'https://api-e-learning-gjnd.onrender.com'
    : 'http://localhost:8080');

console.log('API_BASE_URL:', API_BASE_URL);

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const isLoginEndpoint = endpoint === '/api/auth/login';

  const headers = {

    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };

  if (token && !isLoginEndpoint) {
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
    console.error("Erro de conexão:", err);
    throw new Error('Erro de conexão com o servidor. Tente novamente mais tarde.');
  }
  console.log('Requisição:', {
    url,
    method: config.method || 'GET',
    headers: config.headers,
    body: config.body ? JSON.parse(config.body) : null,
  });
  console.log('Resposta:', {
    status: response.status,
    statusText: response.statusText,
  });


  if (response.status === 401 || response.status === 403) {
    let errorMsg = 'Não autorizado';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || 'Acesso não autorizado ou token inválido.';
    } catch { }
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    let errorMsg = 'Erro ao fazer a requisição';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || `Erro no servidor: ${response.status}`;
    } catch { }
    throw new Error(errorMsg);
  }

  if (response.status === 204) return response;

  return response;
};
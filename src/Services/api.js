const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (err) {
    console.error("Erro de conexão com o backend:", err);
    throw new Error('Erro de conexão com o servidor. Tente novamente mais tarde.');
  }

  if (response.status === 401 || response.status === 403) {
    let errorMsg = 'Não autorizado';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
      if (errorMsg.toLowerCase().includes('senha')) {
        console.warn("Senha incorreta:", errorMsg);
      } else {
        console.warn("Erro de autorização:", errorMsg);
      }
    } catch {
      console.warn("Erro de autorização (sem mensagem detalhada).");
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error(errorMsg);
  }

  if (!response.ok) {
    let errorMsg = 'Erro ao fazer a requisição';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
      console.error("Erro do backend:", errorMsg);
    } catch {
      console.error("Erro desconhecido do backend.");
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return response;
  }

  return response;
};
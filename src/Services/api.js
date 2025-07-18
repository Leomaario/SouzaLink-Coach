export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (token && !isAuthEndpoint) {
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
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  if (response.status === 204) {
    return response;
  }

  return response;
};

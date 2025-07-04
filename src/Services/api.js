export const apiFetch = async (url, options = {}) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('token');

  // Configura os cabeçalhos padrão
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
  const response = await fetch(url, config);
  if (response.status === 401 || response.status === 403) {
    console.error("Erro de autorização. Deslogando...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; 
    throw new Error('Não autorizado');
  }
  if (response.status === 204) {
    return response; // Retorna vazio se não houver conteúdo
  }
  return response;
};
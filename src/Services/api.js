// src/services/api.js

/**
 * Uma função wrapper em torno da API fetch para adicionar automaticamente 
 * o token de autenticação e tratar erros comuns.
 * * @param {string} url O endpoint da API a ser chamado.
 * @param {object} options As opções da requisição fetch (method, body, etc.).
 * @returns {Promise<Response>} A resposta da API.
 */
export const apiFetch = async (url, options = {}) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('token');

  // Configura os cabeçalhos padrão
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite que cabeçalhos customizados sejam adicionados
  };

  // Se o token existir, adiciona ao cabeçalho de autorização
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Monta a configuração final da requisição
  const config = {
    ...options,
    headers,
  };

  // Faz a chamada fetch
  const response = await fetch(url, config);

  // BÔNUS: Se a resposta for 401 ou 403, o token é inválido ou expirou.
  // Vamos deslogar o usuário automaticamente.
  if (response.status === 401 || response.status === 403) {
    console.error("Erro de autorização. Deslogando...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redireciona para a página de login
    window.location.href = '/'; 
    // Lança um erro para interromper a execução do código que fez a chamada
    throw new Error('Não autorizado');
  }

  return response;
};
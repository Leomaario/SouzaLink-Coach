import React, { useState } from 'react';
import '../../src/Styles/Css-Admin/CriarCatalogo.css';
import { useEffect } from 'react';



const CriarCatalogo = () => {
  // --- NOVOS ESTADOS PARA OS DADOS DO FORMULÁRIO ---
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  // Adicionamos um campo para o caminho da pasta, como planejamos
  const [caminhoPasta, setCaminhoPasta] = useState(''); 
  
  // --- NOVOS ESTADOS PARA OS VÍDEOS (CURSOS) ---
  const [videosDisponiveis, setVideosDisponiveis] = useState([]); // Lista de vídeos virá do backend
  const [videosSelecionados, setVideosSelecionados] = useState([]); // Guarda os IDs dos vídeos selecionados

  // --- NOVOS ESTADOS PARA FEEDBACK AO USUÁRIO ---
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LÓGICA NOVA: BUSCANDO OS VÍDEOS DO BACKEND ---
  // Este useEffect roda uma vez quando o componente carrega
  useEffect(() => {
    // Busca todos os vídeos existentes para mostrar como opção
    fetch('http://localhost:8080/api/videos')
      .then(response => {
        if (response.ok && response.status !== 204) {
          return response.json(); // Se a resposta for OK, transforma em JSON
        }
        return []; // Se não, retorna uma lista vazia
      })
      .then(data => setVideosDisponiveis(data))
      .catch(error => console.error('Erro ao buscar vídeos:', error));
  }, []); // O array vazio [] garante que isso só rode uma vez

  // Função para lidar com a seleção dos checkboxes
  const handleCheckboxChange = (videoId) => {
    setVideosSelecionados(prevSelecionados =>
      prevSelecionados.includes(videoId)
        ? prevSelecionados.filter(id => id !== videoId)
        : [...prevSelecionados, videoId]
    );
  };

  // --- LÓGICA NOVA: ENVIANDO O FORMULÁRIO PARA A API ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página
    setLoading(true);
    setMensagem('');

    // Monta o objeto do novo catálogo com os dados do formulário
    const novoCatalogo = {
      nome, // forma curta de nome: nome
      descricao,
      caminhoPasta
      // Podemos adicionar mais campos aqui no futuro (icone, tag, etc.)
    };

    try {
      // Envia os dados do novo catálogo para o backend usando POST
      const response = await fetch('http://localhost:8080/api/catalogos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoCatalogo),
      });

      if (!response.ok) {
        // Se o backend responder com um erro, a gente para aqui
        throw new Error('Falha ao criar o catálogo. O servidor respondeu com um erro.');
      }

      // Se a criação do catálogo deu certo, agora a gente precisaria "linkar" os vídeos.
      // A gente vai implementar essa lógica depois, mas ela ficaria aqui.
      
      setMensagem('Catálogo criado com sucesso!');
      // Limpa os campos do formulário após o sucesso
      setNome('');
      setDescricao('');
      setCaminhoPasta('');
      setVideosSelecionados([]);

    } catch (error) {
      console.error('Erro no submit:', error);
      setMensagem(error.message || 'Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // --- O JSX AGORA É UM FORMULÁRIO COMPLETO E DINÂMICO ---
  return (
    <div className="criar-catalogo-container">
      <h2>Criar Novo Catálogo</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome do Catálogo</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Impressoras e Manutenção"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o que este catálogo aborda..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="caminhoPasta">Caminho da Pasta no Servidor</label>
          <input
            id="caminhoPasta"
            type="text"
            value={caminhoPasta}
            onChange={(e) => setCaminhoPasta(e.target.value)}
            placeholder="Ex: D:/videos/impressoras/"
            required
          />
        </div>

        <div className="form-group">
          <label>Associar Vídeos (Funcionalidade Futura)</label>
          <div className="cursos-lista">
            {videosDisponiveis.length > 0 ? (
              videosDisponiveis.map((video) => (
                <label key={video.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={videosSelecionados.includes(video.id)}
                    onChange={() => handleCheckboxChange(video.id)}
                  />
                  {video.titulo}
                </label>
              ))
            ) : (
              <p>Nenhum vídeo disponível para associação.</p>
            )}
          </div>
        </div>

        <button type="submit" className="botao-criar" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Catálogo'}
        </button>

        {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
      </form>
    </div>
  );
};

export default CriarCatalogo;
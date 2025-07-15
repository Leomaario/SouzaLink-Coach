import React, { useState, useEffect } from 'react';
import '../../src/Styles/Css-Admin/CriarCatalogo.css';
import { apiFetch } from '../Services/api';

const CriarCatalogo = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [caminhoPasta, setCaminhoPasta] = useState('');
  const [videosDisponiveis, setVideosDisponiveis] = useState([]);
  const [videosSelecionados, setVideosSelecionados] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await apiFetch('/videos');
        if (response.ok && response.status !== 204) {
          const data = await response.json();
          setVideosDisponiveis(data);
        } else {
          setVideosDisponiveis([]);
        }
      } catch (error) {
        if (error.message !== 'Não autorizado') {
          console.error('Erro ao buscar vídeos:', error);
        }
      }
    };
    fetchVideos();
  }, []);

  const handleCheckboxChange = (videoId) => {
    setVideosSelecionados(prevSelecionados =>
      prevSelecionados.includes(videoId)
        ? prevSelecionados.filter(id => id !== videoId)
        : [...prevSelecionados, videoId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMensagem('');

    const novoCatalogo = {
      nome,
      descricao,
      caminhoPasta
    };

    try {
      const response = await apiFetch('/catalogos', {
        method: 'POST',
        body: JSON.stringify(novoCatalogo),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o catálogo. O servidor respondeu com um erro.');
      }

      setMensagem('Catálogo criado com sucesso!');
      setNome('');
      setDescricao('');
      setCaminhoPasta('');
      setVideosSelecionados([]);
    } catch (error) {
      if (error.message !== 'Não autorizado') {
        console.error('Erro no submit:', error);
        setMensagem(error.message || 'Ocorreu um erro. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

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
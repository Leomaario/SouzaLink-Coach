import React, { useState, useEffect } from 'react';
import '../../Styles/PlayerCurso.css'; 
import { useParams, Link } from 'react-router-dom';

const PlayerCurso = () => {

  
  const { id } = useParams(); 
  const [videoAtual, setVideoAtual] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (!id) return;

    const fetchDadosDoCurso = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Busca os dados do vídeo principal
        const videoResponse = await fetch(`http://localhost:8080/api/videos/${id}`);
        if (!videoResponse.ok) {
          throw new Error(`Vídeo com ID ${id} não encontrado.`);
        }
        const videoData = await videoResponse.json();
        setVideoAtual(videoData);

        // 2. Busca a playlist do mesmo catálogo
        if (videoData?.catalogo?.id) {
          const catalogoId = videoData.catalogo.id;
          const playlistResponse = await fetch(`http://localhost:8080/api/catalogos/${catalogoId}/videos`);
          if (playlistResponse.ok) {
            const playlistData = await playlistResponse.json();
            setPlaylist(playlistData || []);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados do curso:", err);
        setError(err.message || "Ocorreu um erro ao carregar o curso.");
      } finally {
        setLoading(false);
      }
    };

    fetchDadosDoCurso();
  }, [id]);

  if (loading) {
    return <div className="player-curso-wrapper"><p className="status-message">Carregando curso...</p></div>;
  }

  if (error || !videoAtual) {
    return <div className="player-curso-wrapper"><p className="status-message error-message">{error || "Curso não encontrado."}</p></div>;
  }

  const videoStreamUrl = `http://localhost:8080/api/videos/${videoAtual.id}/stream`;

  return (
    <div className="player-curso-wrapper">
      <div className="player-main">
        <div className="video-box">
          <video key={videoAtual.id} controls autoPlay className="video-player">
            <source src={videoStreamUrl} type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeo.
          </video>
          <div className="video-details">
            <h2>{videoAtual.titulo}</h2>
            <p>{videoAtual.descricao}</p>
          </div>
        </div>

        <div className="curso-sidebar">
          <h3>Conteúdo do Curso</h3>
          <ul className="aulas-lista">
            {playlist.length > 0 ? (
              playlist.map(videoDaLista => (
                <li key={videoDaLista.id} className={videoDaLista.id === videoAtual.id ? 'active' : ''}>
                  <Link to={`/curso/${videoDaLista.id}`}>
                    {videoDaLista.titulo}
                  </Link>
                </li>
              ))
            ) : (
              <li>Nenhum outro vídeo neste catálogo.</li>
            )}
          </ul>
          <button className="botao-concluir">Marcar como concluído</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCurso;

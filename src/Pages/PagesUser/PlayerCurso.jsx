import React, { useState, useEffect } from 'react';
import '../../Styles/PlayerCurso.css'; 
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api'; 

const PlayerCurso = () => {
  const { id } = useParams(); 
  const [videoAtual, setVideoAtual] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [videoSrc, setVideoSrc] = useState(''); // <<< NOVO ESTADO PARA O URL DO VÍDEO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar os metadados do vídeo e a playlist
 useEffect(() => {
    if (!id) return;

    const fetchDadosDoCurso = async () => {
      try {
        setLoading(true);
        setError(null);
        setVideoAtual(null);
        setVideoSrc('');

        // AQUI ESTÁ A CORREÇÃO CRÍTICA: USANDO O CAMINHO "/buscar/"
        const videoResponse = await apiFetch(`http://localhost:8080/api/videos/buscar/${id}`);
        
        if (!videoResponse.ok) {
          // O .json() aqui vai ler a mensagem de erro que o backend envia (ex: "Não encontrado")
          const errorData = await videoResponse.json().catch(() => null); // Tenta ler o erro, mas não falha se estiver vazio
          throw new Error(errorData?.message || `Vídeo com ID ${id} não encontrado.`);
        }
        
        const videoData = await videoResponse.json();
        setVideoAtual(videoData);

        // O resto da sua lógica para buscar a playlist continua igual...
        if (videoData?.catalogo?.id) {
          const catalogoId = videoData.catalogo.id;
          const playlistResponse = await apiFetch(`http://localhost:8080/api/catalogos/${catalogoId}/videos`);
          if (playlistResponse.ok) {
            const playlistData = await playlistResponse.json();
            setPlaylist(playlistData || []);
          }
        }
      } catch (err) {
        if (err.message !== 'Não autorizado') {
            console.error("Erro ao buscar dados do curso:", err);
            setError(err.message || "Ocorreu um erro ao carregar o curso.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDadosDoCurso();
  }, [id]);

  // --- LÓGICA NOVA PARA O STREAMING AUTENTICADO ---
  // Efeito para buscar o VÍDEO em si (o arquivo) depois que os DADOS do vídeo foram carregados
  useEffect(() => {
    // Só roda se já tivermos os dados do vídeo e ainda não tivermos o src
    if (videoAtual && !videoSrc) {
      const fetchVideoFile = async () => {
        try {
          const streamUrl = `http://localhost:8080/api/videos/${videoAtual.id}/stream`;
          // 3. Usa o apiFetch para buscar o arquivo de vídeo (ele envia o token)
          const response = await apiFetch(streamUrl);

          if (!response.ok) {
            throw new Error('Falha ao carregar o arquivo de vídeo.');
          }

          // Converte a resposta em um Blob
          const videoBlob = await response.blob();
          // Cria um URL de objeto local para o Blob
          const objectURL = URL.createObjectURL(videoBlob);
          // Define este URL local como a fonte do vídeo
          setVideoSrc(objectURL);

        } catch(err) {
            if (err.message !== 'Não autorizado') {
                console.error("Erro ao carregar o streaming:", err);
                setError("Não foi possível carregar o vídeo.");
            }
        }
      };

      fetchVideoFile();
    }
  }, [videoAtual, videoSrc]); // Depende do videoAtual e do videoSrc


  if (loading) {
    return <div className="player-curso-wrapper"><p className="status-message">Carregando curso...</p></div>;
  }

  if (error || !videoAtual) {
    return <div className="player-curso-wrapper"><p className="status-message error-message">{error || "Curso não encontrado."}</p></div>;
  }
  
  return (
    <div className="player-curso-wrapper">
      <div className="player-main">
        <div className="video-box">
          {/* Se o videoSrc estiver pronto, renderiza o player. Senão, mostra "Carregando vídeo..." */}
          {videoSrc ? (
            <video key={videoAtual.id} controls autoPlay className="video-player">
                {/* O src agora usa nosso URL de Blob local e seguro */}
                <source src={videoSrc} type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeo.
            </video>
          ) : (
            <div className="video-player-loading">Carregando vídeo...</div>
          )}
          <div className="video-details">
            <h2>{videoAtual.titulo}</h2>
            <p>{videoAtual.descricao}</p>
          </div>
        </div>

        <div className="curso-sidebar">
            {/* O resto do seu componente (playlist, etc) continua igual */}
        </div>
      </div>
    </div>
  );
};

export default PlayerCurso;
import React, { useState, useEffect } from 'react';
import '../../Styles/PlayerCurso.css'; 
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';

const PlayerCurso = () => {
    const { id } = useParams();
    // Juntamos todos os dados do curso num único estado
    const [cursoData, setCursoData] = useState({
        video: null,
        playlist: [],
        videoSrc: '',
        concluido: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseUrl = 'http://localhost:8080';

    useEffect(() => {
        if (!id) return;

        // Função "mestra" que busca tudo em sequência
        const fetchTudo = async () => {
            setLoading(true);
            setError(null);

            try {
                // --- ETAPA 1: BUSCAR OS METADADOS DO VÍDEO ---
                const videoResponse = await apiFetch(`${apiBaseUrl}/api/videos/buscar/${id}`);
                if (!videoResponse.ok) throw new Error(`Vídeo com ID ${id} não encontrado.`);
                const videoInfo = await videoResponse.json();
                
                // --- ETAPA 2: BUSCAR A PLAYLIST ---
                let playlistData = [];
                if (videoInfo?.catalogoId) {
                    const playlistResponse = await apiFetch(`${apiBaseUrl}/api/catalogos/${videoInfo.catalogoId}/videos`);
                    if (playlistResponse.ok) {
                        playlistData = await playlistResponse.json();
                    }
                }
                
                // --- ETAPA 3: BUSCAR O STATUS DE CONCLUSÃO ---
                let statusConcluido = false;
                const statusResponse = await apiFetch(`${apiBaseUrl}/api/progresso/${id}/status`);
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    statusConcluido = statusData.concluido;
                }

                // --- ETAPA 4: BUSCAR O FICHEIRO DE VÍDEO (STREAM) ---
                const streamResponse = await apiFetch(`${apiBaseUrl}/api/videos/${id}/stream`);
                if (!streamResponse.ok) throw new Error('Falha ao carregar o arquivo de vídeo.');
                const videoBlob = await streamResponse.blob();
                const objectURL = URL.createObjectURL(videoBlob);

                // --- ETAPA FINAL: ATUALIZAR O ESTADO COM TUDO DE UMA SÓ VEZ ---
                setCursoData({
                    video: videoInfo,
                    playlist: playlistData,
                    videoSrc: objectURL,
                    concluido: statusConcluido
                });

            } catch (err) {
                if (err.message !== 'Não autorizado') setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTudo();
    }, [id]); // Roda sempre que o ID na URL muda

    const handleMarcarConcluido = async () => {
        // Atualização otimista da UI
        setCursoData(prev => ({ ...prev, concluido: true }));
        try {
            const response = await apiFetch(`${apiBaseUrl}/api/progresso/${id}/marcar-concluido`, { method: 'POST' });
            if (!response.ok) {
                alert('Ocorreu um erro ao marcar o vídeo como concluído.');
                setCursoData(prev => ({ ...prev, concluido: false })); // Reverte se der erro
            }
        } catch (error) {
            console.error("Erro ao marcar como concluído:", error);
            alert('Ocorreu um erro de rede.');
            setCursoData(prev => ({ ...prev, concluido: false }));
        }
    };

    if (loading) {
        return <div className="player-curso-wrapper"><p className="status-message">A carregar curso...</p></div>;
    }

    if (error) {
        return <div className="player-curso-wrapper"><p className="status-message error-message">{error}</p></div>;
    }

    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    <video key={cursoData.video.id} controls autoPlay className="video-player">
                        <source src={cursoData.videoSrc} type="video/mp4" />
                        Seu navegador não suporta a reprodução de vídeo.
                    </video>
                    <div className="video-details">
                        <h2>{cursoData.video.titulo}</h2>
                        <p>{cursoData.video.descricao}</p>
                    </div>
                </div>

                <div className="curso-sidebar">
                    <h3>Conteúdo do Catálogo</h3>
                    <ul className="aulas-lista">
                        <li className="active">
                            <Link to={`/curso/${cursoData.video.id}`}>
                                ▶️ {cursoData.video.titulo} (a assistir)
                            </Link>
                        </li>
                        {cursoData.playlist
                            .filter(v => v.id !== cursoData.video.id)
                            .map(videoDaLista => (
                                <li key={videoDaLista.id}>
                                    <Link to={`/curso/${videoDaLista.id}`}>{videoDaLista.titulo}</Link>
                                </li>
                        ))}
                    </ul>
                    <button 
                        onClick={handleMarcarConcluido} 
                        className="botao-concluir"
                        disabled={cursoData.concluido}
                    >
                        {cursoData.concluido ? 'Concluído ✔️' : 'Marcar como concluído'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerCurso;
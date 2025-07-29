import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube'; // Import direto do YouTube player
import '../../Styles/PlayerCurso.css';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';

const LoadingState = () => (
    <div className="player-curso-wrapper">
        <p className="status-message">Carregando curso...</p>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="player-curso-wrapper">
        <p className="status-message error-message">{message}</p>
    </div>
);

// Verifica se é um link válido do YouTube
const isValidYouTubeUrl = (url) =>
    typeof url === 'string' && ReactPlayer.canPlay(url) && url.includes('youtube.com');

const PlayerCurso = () => {
    const { id } = useParams();
    const [cursoData, setCursoData] = useState({ video: null, playlist: [] });
    const [concluido, setConcluido] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchVideoData = async () => {
            setLoading(true);
            setError(null);
            setPlaying(false);

            try {
                const res = await apiFetch(`/api/videos/buscar/${id}`, { signal });
                if (!res.ok) throw new Error('Vídeo não encontrado');
                const video = await res.json();

                let playlist = [];
                if (video.catalogoId) {
                    const playlistRes = await apiFetch(`/api/catalogos/${video.catalogoId}/videos`, { signal });
                    if (playlistRes.ok) playlist = await playlistRes.json();
                }

                let statusConcluido = false;
                const statusRes = await apiFetch(`/api/progresso/${id}/status`, { signal });
                if (statusRes.ok) {
                    const status = await statusRes.json();
                    statusConcluido = status.concluido;
                }

                setCursoData({ video, playlist });
                setConcluido(statusConcluido);

                // Inicia o vídeo automaticamente se for válido
                if (isValidYouTubeUrl(video.urlDoVideo)) {
                    setPlaying(true);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
        return () => controller.abort();
    }, [id]);

    const handleMarcarConcluido = async () => {
        setConcluido(true);
        try {
            const res = await apiFetch(`/api/progresso/${id}/marcar-concluido`, { method: 'POST' });
            if (!res.ok) {
                alert('Erro ao marcar como concluído.');
                setConcluido(false);
            }
        } catch {
            alert('Erro ao conectar com o servidor.');
            setConcluido(false);
        }
    };

    if (loading) return <LoadingState />;
    if (error || !cursoData.video) return <ErrorState message={error || 'Vídeo não disponível.'} />;

    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    <div className="player-wrapper-responsive">
                        {isValidYouTubeUrl(cursoData.video.urlDoVideo) ? (
                            <ReactPlayer
                                key={id}
                                className="react-player"
                                url={cursoData.video.urlDoVideo}
                                controls
                                playing={playing}
                                muted
                                width="100%"
                                height="100%"
                            />
                        ) : (
                            <p className="status-message error-message">
                                URL inválida ou vídeo do YouTube indisponível.
                            </p>
                        )}
                    </div>
                    <div className="video-details">
                        <h2>{cursoData.video.titulo}</h2>
                        <p>{cursoData.video.descricao}</p>
                    </div>
                </div>

                <div className="curso-sidebar">
                    <h3>Conteúdo do Catálogo</h3>
                    <ul className="aulas-lista">
                        {cursoData.playlist.map((video) => (
                            <li key={video.id} className={video.id === cursoData.video.id ? 'active' : ''}>
                                <Link to={`/curso/${video.id}`}>
                                    {video.id === cursoData.video.id && '▶️ '}
                                    {video.titulo}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleMarcarConcluido}
                        className="botao-concluir"
                        disabled={concluido}
                    >
                        {concluido ? 'Concluído ✔️' : 'Marcar como concluído'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerCurso;

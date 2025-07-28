import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import '../../Styles/PlayerCurso.css'; 
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';

const PlayerCurso = () => {
    const { id } = useParams();
    const [cursoData, setCursoData] = useState({
        video: null,
        playlist: [],
        concluido: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        let isMounted = true; // Flag para verificar se o componente está "montado"

        const fetchTudo = async () => {
            setLoading(true);
            setError(null);
            try {
                const videoResponse = await apiFetch(`/api/videos/buscar/${id}`);
                if (!videoResponse.ok) throw new Error(`Vídeo com ID ${id} não encontrado.`);
                const videoInfo = await videoResponse.json();
                
                if (!videoInfo.urlDoVideo) {
                    throw new Error('URL do vídeo não encontrada na resposta da API.');
                }
                
                let playlistData = [];
                if (videoInfo?.catalogoId) {
                    const playlistResponse = await apiFetch(`/api/catalogos/${videoInfo.catalogoId}/videos`);
                    if (playlistResponse.ok) {
                        playlistData = await playlistResponse.json();
                    }
                }

                let statusConcluido = false;
                const statusResponse = await apiFetch(`/api/progresso/${id}/status`);
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    statusConcluido = statusData.concluido;
                }
                
                if (isMounted) {
                    setCursoData({
                        video: videoInfo,
                        playlist: playlistData,
                        concluido: statusConcluido
                    });
                }

            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTudo();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleMarcarConcluido = async () => {
        setCursoData(prev => ({ ...prev, concluido: true }));
        try {
            const response = await apiFetch(`/api/progresso/${id}/marcar-concluido`, { method: 'POST' });
            if (!response.ok) {
                alert('Ocorreu um erro ao marcar o vídeo como concluído.');
                setCursoData(prev => ({ ...prev, concluido: false }));
            }
        } catch (error) {
            setCursoData(prev => ({ ...prev, concluido: false }));
            alert('Ocorreu um erro de rede.');
        }
    };

    if (loading) {
        return <div className="player-curso-wrapper"><p className="status-message">A carregar curso...</p></div>;
    }

    if (error || !cursoData.video) {
        return <div className="player-curso-wrapper"><p className="status-message error-message">{error || "Vídeo não encontrado."}</p></div>;
    }

    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    <div className='player-wrapper-responsive'>
                        <ReactPlayer
                            className='react-player'
                            url={cursoData.video.urlDoVideo} 
                            width='100%'
                            height='100%'
                            controls={true}
                            playing={true}
                            muted={true}
                            
                            // A propriedade 'config' que causava o erro foi removida daqui

                            onError={(e) => console.error('!!! ERRO NO PLAYER !!!:', e)}
                            onPlay={() => console.log('Player recebeu o comando PLAY (onPlay)')}
                            onStart={() => console.log('>>> O VÍDEO REALMENTE COMEÇOU A TOCAR (onStart) <<<')}
                            onPause={() => console.log('Vídeo pausado (onPause)')}
                            onEnded={() => console.log('Vídeo finalizado (onEnded)')}
                        />
                    </div>
                    <div className="video-details">
                        <h2>{cursoData.video.titulo}</h2>
                        <p>{cursoData.video.descricao}</p>
                    </div>
                </div>

                <div className="curso-sidebar">
                    <h3>Conteúdo do Catálogo</h3>
                    <ul className="aulas-lista">
                        {cursoData.playlist.map(videoDaLista => (
                            <li key={videoDaLista.id} className={videoDaLista.id === cursoData.video.id ? 'active' : ''}>
                                <Link to={`/curso/${videoDaLista.id}`}>
                                    {videoDaLista.id === cursoData.video.id && '▶️ '}
                                    {videoDaLista.titulo}
                                </Link>
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
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import '../../Styles/PlayerCurso.css';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';
import { BsPlusCircleFill, BsPencilSquare, BsTrashFill } from 'react-icons/bs'



const PlayerCurso = () => {
    const { id } = useParams();
    const [cursoData, setCursoData] = useState({
        video: null,
        playlist: [],
        concluido: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [playerKey, setPlayerKey] = useState(0);
    const playerRef = useRef(null);
    const isMounted = useRef(true);




    //corrige o erro Uncaught (in promise) AbortError: The play() request was interrupted because the media was removed from the document. https://goo.gl/LdLk22
    const [shouldPlay, setShouldPlay] = useState(false);
    useEffect(() => {
        if (shouldPlay && playerRef.current) {
            playerRef.current.play();
        }
    }, [shouldPlay]);


    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    const apiFetch = (endpoint, options = {}) => fetch('https://api-e-learning-gjnd.onrender.com/api/user-dashboard/data', {
        headers: headers
    });


    useEffect(() => {
        isMounted.current = true;
        setIsPlayerReady(false);
        setShouldPlay(false);
        setLoading(true);
        setError(null);


        const carregarDados = async () => {
            try {
                const response = await apiFetch(`/api/videos/buscar/${id}`);
                if (!response.ok) throw new Error('Vídeo não encontrado');
                const video = await response.json();

                let playlist = [];
                if (video.catalogoId) {
                    const playlistRes = await apiFetch(`/api/catalogos/${video.catalogoId}/videos`);
                    if (playlistRes.ok) {
                        playlist = await playlistRes.json();
                    }
                }

                let concluido = false;
                const statusRes = await apiFetch(`/api/progresso/${id}/status`);
                if (statusRes.ok) {
                    const status = await statusRes.json();
                    concluido = status.concluido;
                }

                if (isMounted.current) {
                    setCursoData({ video, playlist, concluido });
                    setPlayerKey(prev => prev + 1);

                    // Aguarda montagem do componente para ativar o player
                    setTimeout(() => {
                        if (isMounted.current) {
                            setIsPlayerReady(true);
                            setShouldPlay(true);
                        }
                    }, 500);
                }
            } catch (err) {
                if (isMounted.current) {
                    setError(err.message);
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        carregarDados();

        // Limpeza do efeito para evitar vazamentos de memória
        return () => {
            isMounted.current = false;
            if (playerRef.current) {
                playerRef.current.getInternalPlayer().pause();
            }
            setIsPlayerReady(false);
            setShouldPlay(false);
            setPlayerKey(0);
            setCursoData({ video: null, playlist: [], concluido: false });
            setLoading(true);
            setError(null);

        };
    }, [id]);

    const handleMarcarConcluido = async () => {
        setCursoData(prev => ({ ...prev, concluido: true }));
        try {
            const response = await apiFetch(`/api/progresso/${id}/marcar-concluido`, {
                method: 'POST',
            });
            if (!response.ok) {
                alert('Erro ao marcar como concluído.');
                setCursoData(prev => ({ ...prev, concluido: false }));
            }
        } catch {
            alert('Erro ao conectar com o servidor.');
            setCursoData(prev => ({ ...prev, concluido: false }));
        }
    };

    if (loading) {
        return <div className="player-curso-wrapper"><p className="status-message">Carregando curso...</p></div>;
    }

    if (error || !cursoData.video) {
        return <div className="player-curso-wrapper"><p className="status-message error-message">{error || "Vídeo não disponível."}</p></div>;
    }

    //corrige o erro do stream não reproduzir e mostra no log
    if (!isPlayerReady) {
        return <div className="player-curso-wrapper"><p className="status-message">Preparando o player...</p></div>;
    }

    if (isPlayerReady) {
        shouldPlay = true;
    }


    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    <div className="player-wrapper-responsive">
                        {isPlayerReady && (
                            <ReactPlayer
                                key={playerKey}
                                ref={playerRef}
                                url={cursoData.video.urlDoVideo}
                                controls
                                playing={false}
                                muted={true}
                                width="100%"
                                height="100%"
                                playsinline

                                onReady={() => console.log("✅ O VÍDEO ESTÁ PRONTO")}
                                onPlay={() => console.log("▶️ Player recebeu comando PLAY")}
                                onPause={() => console.log("⏸️ Vídeo pausado")}
                                onError={(e) => console.error('❌ Erro no player:', e)}
                            />
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
                        {cursoData.playlist.map(video => (
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

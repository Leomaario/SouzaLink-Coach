import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import '../../Styles/PlayerCurso.css';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';
import { BsPlusCircleFill, BsPencilSquare, BsTrashFill } from 'react-icons/bs';

const PlayerCurso = () => {
    const { id } = useParams();
    const [cursoData, setCursoData] = useState({
        video: null,
        playlist: [],
        concluido: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playing, setPlaying] = useState(false);
    useEffect(() => {
        let isMounted = true;

        const carregarDados = async () => {
            if (!isMounted) return;

            setLoading(true);
            setError(null);
            setPlaying(false);


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

                if (isMounted) {
                    setCursoData({ video, playlist, concluido });
                    setPlaying(true); // Ativa o autoplay após os dados carregarem
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        carregarDados();

        return () => {
            isMounted = false;
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

    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    <div className="player-wrapper-responsive">
                        <ReactPlayer
                            key={id}
                            className='react-player'
                            url={cursoData.video.urlDoVideo}
                            controls={true}
                            width="100%"
                            height="100%"

                            //config para especificar o tipo de player, ou seja? yotube!
                            config={{
                                youtube: {
                                    playerVars: {
                                        showinfo: 0,       // Esconde informações do vídeo  
                                        modestbranding: 1,   // Usa um logo do YouTube menos chamativo na barra de controle
                                        controls: 1,         // Garante que os controles do YouTube apareçam
                                        disablekb: 0         // Permite o controle pelo teclado
                                    }
                                }
                            }}
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
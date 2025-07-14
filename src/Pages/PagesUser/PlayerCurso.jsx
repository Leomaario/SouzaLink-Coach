import React, { useState, useEffect } from 'react';
import '../../Styles/PlayerCurso.css';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';

const PlayerCurso = () => {
    const { id } = useParams();
    // MUDANÇA: Simplificamos o estado. Não precisamos mais de 'videoSrc'.
    const [cursoData, setCursoData] = useState({
        video: null,
        playlist: [],
        concluido: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // REMOVIDO: A URL base agora deve ser gerenciada pelo seu serviço 'api.js'.
    // const apiBaseUrl = 'http://localhost:8080';

    useEffect(() => {
        if (!id) return;
        const fetchTudo = async () => {
            setLoading(true);
            setError(null);
            try {
                // MUDANÇA: Usando caminhos relativos na API.
                const videoResponse = await apiFetch(`/videos/buscar/${id}`);
                if (!videoResponse.ok) throw new Error(`Vídeo com ID ${id} não encontrado.`);
                const videoInfo = await videoResponse.json();

                // O 'videoInfo' que chega da API agora já tem o campo 'urlDoVideo'.
                
                let playlistData = [];
                if (videoInfo?.catalogoId) {
                    const playlistResponse = await apiFetch(`/catalogos/${videoInfo.catalogoId}/videos`);
                    if (playlistResponse.ok) {
                        playlistData = await playlistResponse.json();
                    }
                }

                let statusConcluido = false;
                const statusResponse = await apiFetch(`/progresso/${id}/status`);
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    statusConcluido = statusData.concluido;
                }

                // REMOVIDO: Toda a lógica de chamar o endpoint /stream, criar blob e objectURL foi apagada.
                
                // MUDANÇA: O estado é definido com as informações diretas.
                setCursoData({
                    video: videoInfo,
                    playlist: playlistData,
                    concluido: statusConcluido
                });

            } catch (err) {
                if (err.message !== 'Não autorizado') setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTudo();
    }, [id]);

    const handleMarcarConcluido = async () => {
        setCursoData(prev => ({ ...prev, concluido: true }));
        try {
            // MUDANÇA: Usando caminhos relativos na API.
            const response = await apiFetch(`/progresso/${id}/marcar-concluido`, { method: 'POST' });
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

    if (error || !cursoData.video) { // Adicionado um check para garantir que 'video' não é nulo
        return <div className="player-curso-wrapper"><p className="status-message error-message">{error || "Vídeo não encontrado."}</p></div>;
    }

    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    {/* MUDANÇA: A tag <video> agora usa a URL direta do objeto 'video' */}
                    <video key={cursoData.video.id} src={cursoData.video.urlDoVideo} controls autoPlay className="video-player">
                        {/* A tag <source> pode ser removida se o src for direto na tag <video> */}
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
                        {/* A lógica da playlist continua a mesma, mas agora está mais segura */}
                        {cursoData.playlist.map(videoDaLista => (
                            <li key={videoDaLista.id} className={videoDaLista.id === cursoData.video.id ? 'active' : ''}>
                                <Link to={`/curso/${videoDaLista.id}`}>
                                    {videoDaLista.id === cursoData.video.id && ' '}
                                    {videoDaLista.titulo}
                                    {videoDaLista.id === cursoData.video.id && ' (a assistir)'}
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
import React, { useState, useEffect } from 'react';
import '../../Styles/PlayerCurso.css'; 
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';

const PlayerCurso = () => {
    const { id } = useParams(); 
    const [videoAtual, setVideoAtual] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [videoSrc, setVideoSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchDadosDoCurso = async () => {
            setLoading(true); // Garante que o loading seja reativado ao navegar para um novo vídeo
            setError(null);
            
            try {
                const videoResponse = await apiFetch(`/api/videos/buscar/${id}`);
                if (!videoResponse.ok) {
                    throw new Error(`Vídeo com ID ${id} não encontrado.`);
                }
                const videoData = await videoResponse.json();
                setVideoAtual(videoData);

                if (videoData?.catalogoId) {
                    const playlistResponse = await apiFetch(`/api/catalogos/${videoData.catalogoId}/videos`);
                    if (playlistResponse.ok) {
                        const playlistData = await playlistResponse.json();
                        setPlaylist(playlistData || []);
                    }
                }
            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDadosDoCurso();
    }, [id]);

    useEffect(() => {
        if (videoAtual && videoAtual.id.toString() === id) { // Garante que estamos a carregar o vídeo certo
            setVideoSrc(''); // Limpa o src antigo antes de carregar o novo
            const fetchVideoFile = async () => {
                try {
                    const response = await apiFetch(`/api/videos/${videoAtual.id}/stream`);
                    if (!response.ok) throw new Error('Falha ao carregar o arquivo de vídeo.');
                    const videoBlob = await response.blob();
                    const objectURL = URL.createObjectURL(videoBlob);
                    setVideoSrc(objectURL);
                } catch(err) {
                    if (err.message !== 'Não autorizado') setError("Não foi possível carregar o vídeo.");
                }
            };
            fetchVideoFile();
        }
    }, [videoAtual, id]); // Depende do vídeo principal e do ID da URL

    const handleMarcarConcluido = () => {
        alert("Funcionalidade de marcar como concluído será implementada em breve!");
    };

    // --- NOVA ESTRUTURA DE RENDERIZAÇÃO ---

    // 1. Primeiro, verificamos se está a carregar
    if (loading) {
        return <div className="player-curso-wrapper"><p className="status-message">A carregar curso...</p></div>;
    }

    // 2. Se não estiver a carregar, verificamos se há um erro
    if (error) {
        return <div className="player-curso-wrapper"><p className="status-message error-message">{error}</p></div>;
    }

    // 3. Se não está a carregar E não há erro, mas o videoAtual ainda não chegou, mostramos um último loading.
    //    Isto é uma segurança extra.
    if (!videoAtual) {
        return <div className="player-curso-wrapper"><p className="status-message">A preparar o player...</p></div>;
    }
    
    // 4. Se chegámos aqui, é 100% seguro desenhar a página
    return (
        <div className="player-curso-wrapper">
            <div className="player-main">
                <div className="video-box">
                    {videoSrc ? (
                        <video key={videoAtual.id} controls autoPlay className="video-player">
                            <source src={videoSrc} type="video/mp4" />
                            Seu navegador não suporta a reprodução de vídeo.
                        </video>
                    ) : (
                        <div className="video-player-loading">A carregar vídeo...</div>
                    )}
                    <div className="video-details">
                        <h2>{videoAtual.titulo}</h2>
                        <p>{videoAtual.descricao}</p>
                    </div>
                </div>

                <div className="curso-sidebar">
                    <h3>Conteúdo do Catálogo</h3>
                    <ul className="aulas-lista">
                        <li className="active">
                            <Link to={`/curso/${videoAtual.id}`}>
                                ▶️ {videoAtual.titulo} (a assistir)
                            </Link>
                        </li>
                        {playlist
                            .filter(v => v.id !== videoAtual.id) // Garante que o vídeo atual não se repete na lista
                            .map(videoDaLista => (
                                <li key={videoDaLista.id}>
                                    <Link to={`/curso/${videoDaLista.id}`}>
                                        {videoDaLista.titulo}
                                    </Link>
                                </li>
                        ))}
                    </ul>
                    <button onClick={handleMarcarConcluido} className="botao-concluir">
                        Marcar como concluído
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerCurso;
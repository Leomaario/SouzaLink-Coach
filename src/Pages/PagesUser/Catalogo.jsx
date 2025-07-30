import React, { useState, useEffect } from 'react';
import '@styles/Catalogo.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../Services/api.js';
import { CollectionPlay } from 'react-bootstrap-icons';


function getYouTubeThumbnail(youtubeUrl) {
    if (!youtubeUrl) {
        return null;
    }
    try {

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = youtubeUrl.match(regExp);


        if (match && match[2].length === 11) {
            const videoId = match[2];
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
    } catch (error) {
        console.error("Erro ao processar a URL do YouTube:", youtubeUrl, error);
        return null;
    }

    return null;
}


const Catalogo = () => {
    const navigate = useNavigate();
    const [catalogosComVideos, setCatalogosComVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCatalogos = async () => {
            try {
                setLoading(true);
                setError(null);
                const responseCatalogos = await apiFetch('/api/catalogos');
                if (!responseCatalogos.ok) throw new Error('Falha ao buscar os catálogos.');

                let catalogosData = await responseCatalogos.json();

                if (!Array.isArray(catalogosData)) {
                    console.error("A resposta da API para /api/catalogos não é um array:", catalogosData);
                    catalogosData = []; // Proteção contra o erro .map
                }

                const promises = catalogosData.map(catalogo =>
                    apiFetch(`/api/catalogos/${catalogo.id}/videos`)
                        .then(res => res.ok ? res.json() : [])
                );

                const videosPorCatalogo = await Promise.all(promises);

                const dadosCompletos = catalogosData.map((catalogo, index) => ({
                    ...catalogo,
                    videos: videosPorCatalogo[index] || []
                }));

                setCatalogosComVideos(dadosCompletos);
            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    setError(err.message || 'Ocorreu um erro ao carregar o catálogo.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogos();
    }, []);

    const handleVideoClick = (videoId) => {
        navigate(`/curso/${videoId}`);
    };

    if (loading) {
        return (
            <div className="catalogo-container">
                <h1>Catálogo de Capacitações</h1>
                <p className="status-message">A carregar...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalogo-container">
                <h1>Catálogo de Capacitações</h1>
                <p className="status-message error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="catalogo-container">
            <div className="catalogo-header">
                <h1>Catálogo de Capacitações</h1>
                <p>Explore nossas trilhas de conhecimento e desenvolva novas habilidades.</p>
            </div>
            {catalogosComVideos.map((categoria) => (
                <div key={categoria.id} className="categoria-section">
                    <h2 className="categoria-title">
                        <CollectionPlay />
                        {categoria.nome}
                    </h2>
                    <div className="cursos-row">
                        {categoria.videos?.length > 0 ? (
                            categoria.videos.map(video => (
                                <div
                                    key={video.id}
                                    className="curso-card"
                                    onClick={() => handleVideoClick(video.id)}
                                >
                                    <div className="card-thumbnail">
                                        <img
                                            src={getYouTubeThumbnail(video.urlDoVideo) || `https://placehold.co/300x170/03339c/FFFFFF/png?text=${encodeURIComponent(video.titulo)}`}
                                            alt={video.titulo}
                                        />
                                        <div className="play-icon-overlay">▶</div>
                                    </div>
                                    <div className="card-content">
                                        <h3>{video.titulo}</h3>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="sem-videos-msg">Nenhum curso neste catálogo ainda.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Catalogo;


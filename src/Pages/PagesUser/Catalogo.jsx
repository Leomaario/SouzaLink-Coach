import React, { useState, useEffect } from 'react';
import '@styles/Catalogo.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../Services/api.js';
import { CollectionPlay } from 'react-bootstrap-icons';




function getYouTubeThumbnail(youtubeUrl) {
    if (!youtubeUrl) {
        return null;
    }

    let videoId = '';
    const url = new URL(youtubeUrl);
    if (url.hostname === 'youtu.be') {
        videoId = url.pathname.slice(1);
    } else if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v');
    } else if (url.hostname.includes('youtube-nocookie.com')) {
        videoId = url.pathname.split('/embed/')[1];
    }

    if (!videoId) {
        console.error("Não foi possível extrair o ID do vídeo da URL:", youtubeUrl);
        return null;
    }
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
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

                // Adicionada verificação para garantir que os dados são uma lista (array)
                if (!Array.isArray(catalogosData)) {
                    console.error("A resposta da API para /api/catalogos não é um array:", catalogosData);
                    throw new Error('O formato dos dados recebidos para os catálogos é inválido.');
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
            {catalogosComVideos.length === 0 ? (
                <p className="status-message">Nenhum catálogo disponível no momento.</p>
            ) : (
                catalogosComVideos.map((categoria) => (
                    <div key={categoria.id} className="categoria-section">
                        <h2 className="categoria-title">
                            <CollectionPlay />
                            {categoria.nome}
                        </h2>
                        <div className="cursos-row">
                            {categoria.videos && categoria.videos.length > 0 ? (
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
                ))
            )}
        </div>
    );
};

export default Catalogo;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../Services/api';
import '../../Styles/CatalogoDetalhes.css';

const CatalogoDetalhes = () => {
    const { idCatalogo } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [catalogoInfo, setCatalogoInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetalhesCatalogo = async () => {
            setLoading(true);
            try {
                // Fazemos as duas chamadas em paralelo
                const [responseVideos, responseCatalogo] = await Promise.all([
                    apiFetch(`http://localhost:8080/api/catalogos/${idCatalogo}/videos`),
                    apiFetch(`http://localhost:8080/api/catalogos/${idCatalogo}`)
                ]);

                if (!responseVideos.ok || !responseCatalogo.ok) {
                    throw new Error('Falha ao buscar os detalhes do catálogo.');
                }

                const videosData = await responseVideos.json();
                const catalogoData = await responseCatalogo.json();

                setVideos(videosData || []);
                setCatalogoInfo(catalogoData);

            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (idCatalogo) {
            fetchDetalhesCatalogo();
        }
    }, [idCatalogo]);

    const handleVideoClick = (videoId) => {
        navigate(`/curso/${videoId}`);
    };

    if (loading) return <div className="status-message">A carregar detalhes do catálogo...</div>;
    if (error) return <div className="status-message error">{error}</div>;
    console.log("CatalogoDetalhes - videos:", videos);
    console.log("CatalogoDetalhes - catalogoInfo:", catalogoInfo);
    

    
    return (
        <div className="catalogo-detalhes-container">
            {catalogoInfo && (
                <div className="catalogo-header">
                    <h1>{catalogoInfo.nome}</h1>
                    <p>{catalogoInfo.descricao}</p>
                </div>
            )}
            
            <h2>Cursos Disponíveis</h2>
            <div className="videos-grid">
                {videos.length > 0 ? (
                    videos.map(video => (
                        <div key={video.id} className="video-card" onClick={() => handleVideoClick(video.id)}>
                            <img 
                                src={`https://placehold.co/250x140?text=${encodeURIComponent(video.titulo)}`} 
                                alt={video.titulo} 
                            />
                            <div className="video-card-info">
                                <h3>{video.titulo}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum curso encontrado para este catálogo.</p>
                )}
            </div>
        </div>
    );
};

export default CatalogoDetalhes;
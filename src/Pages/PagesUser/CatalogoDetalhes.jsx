import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Styles/CatalogoDetalhes.css'; // Certifique-se de que o caminho está correto

const CatalogoDetalhes = () => {
    const { idCatalogo } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [catalogoInfo, setCatalogoInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
   


    useEffect(() => {
        const fetchDetalhesCatalogo = async () => {
            try {
                setLoading(true);
                
                const responseVideos = await fetch(`http://localhost:8080/api/catalogos/${idCatalogo}/videos`);
                if (!responseVideos.ok) {
                    throw new Error('Falha ao buscar os vídeos do catálogo.');
                }
                const videosData = await responseVideos.json();
                setVideos(videosData || []);

                // (Opcional, mas recomendado) 2. Busca as informações do próprio catálogo
                const responseCatalogo = await fetch(`http://localhost:8080/api/catalogos/${idCatalogo}`);
                if (!responseCatalogo.ok) {
                    throw new Error('Falha ao buscar informações do catálogo. contate o administrador.');
                }
                const catalogoData = await responseCatalogo.json();
                setCatalogoInfo(catalogoData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetalhesCatalogo();
    }, [idCatalogo]); // A busca roda de novo se o ID do catálogo na URL mudar

    const handleVideoClick = (videoId) => {
        // Navega para a página do player quando um vídeo é clicado
        navigate(`/player/${videoId}`);
    };

    if (loading) return <div className="status-message">Carregando cursos...</div>;
    if (error) return <div className="status-message error">{error}</div>;

    return (
        <div className="catalogo-detalhes-container">
            {/* Mostra o nome e a descrição do catálogo */}
            {catalogoInfo && (
                <div className="catalogo-header">
                    <h1>{catalogoInfo.nome}</h1>
                    <p>{catalogoInfo.descricao}</p>
                </div>
            )}
            
            {/* Lista os vídeos do catálogo em formato de cards */}
            <h2>Cursos Disponíveis</h2>
            <div className="videos-grid"> {/* Use essa classe para fazer um grid no CSS */}
                {videos.length > 0 ? (
                    videos.map(video => (
                        <div key={video.id} className="video-card" onClick={() => handleVideoClick(video.id)}>
                            <img 
                                src={`https://placehold.co/250x140?text=${encodeURIComponent(video.titulo)}`} 
                                alt={video.titulo} 
                            />
                            <div className="video-card-info">
                                <h3>{video.titulo}</h3>
                                {/* Você pode adicionar a descrição do vídeo aqui se quiser */}
                                {/* <p>{video.descricao}</p> */}
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
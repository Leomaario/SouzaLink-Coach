import React, { useState, useEffect } from 'react';
import '@styles/Catalogo.css'; 
import { useNavigate, Link } from 'react-router-dom'; // Adicionamos o Link
import { apiFetch } from '../../Services/api';

const Catalogo = () => {
    const navigate = useNavigate();

    // O estado agora vai guardar os catálogos com os seus vídeos dentro
    const [catalogosComVideos, setCatalogosComVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTudo = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Busca a lista de todos os catálogos
                const responseCatalogos = await apiFetch('http://localhost:8080/api/catalogos');
                if (!responseCatalogos.ok) throw new Error('Falha ao buscar os catálogos.');
                
                const catalogosData = await responseCatalogos.json();

                // 2. Para cada catálogo, cria uma "promessa" de buscar os seus vídeos
                const promises = catalogosData.map(catalogo =>
                    apiFetch(`http://localhost:8080/api/catalogos/${catalogo.id}/videos`)
                        .then(res => res.json())
                );
                
                // 3. Executa todas as "promessas" em paralelo
                const videosPorCatalogo = await Promise.all(promises);

                // 4. Junta os catálogos com as suas respetivas listas de vídeos
                const dadosCompletos = catalogosData.map((catalogo, index) => ({
                    ...catalogo, // Mantém os dados do catálogo (id, nome, etc.)
                    videos: videosPorCatalogo[index] || [] // Adiciona a lista de vídeos correspondente
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

        fetchTudo();
    }, []); 

    if (loading) {
        return <div className="status-message">A carregar catálogos...</div>;
    }
    if (error) {
        return <div className="status-message error">{error}</div>;
    }

    return (
        <div className="catalogo">
            <h1 className="titulo">Catálogo de Capacitações</h1>
            {catalogosComVideos.length === 0 && !loading ? (
                <p className="status-message">Nenhum catálogo disponível no momento.</p>
            ) : (
                // O primeiro map percorre os catálogos
                catalogosComVideos.map((categoria) => (
                    <div key={categoria.id} className="categoria">
                        <h2>{categoria.nome}</h2>
                        <div className="cursos-row">
                            {/* --- RENDERIZAÇÃO DOS VÍDEOS DENTRO DE CADA CATÁLOGO --- */}
                            {categoria.videos && categoria.videos.length > 0 ? (
                                // O segundo map percorre os vídeos daquele catálogo
                                categoria.videos.map(video => (
                                    <Link to={`/curso/${video.id}`} key={video.id} className="curso-card">
                                        <img 
                                            src={`https://placehold.co/250x140?text=${encodeURIComponent(video.titulo)}`} 
                                            alt={video.titulo} 
                                        />
                                        <p>{video.titulo}</p>
                                    </Link>
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
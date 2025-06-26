import React, { useState, useEffect } from 'react';
import '@styles/Catalogo.css'; 
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../Services/api'; // IMPORTA NOSSO NOVO SERVIÇO

const Catalogo = () => {
  const navigate = useNavigate();

  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogosDoBackend = async () => {
      try {
        setLoading(true);
        setError(null);
        // USA O apiFetch, QUE JÁ ENVIA O TOKEN!
        const response = await apiFetch('http://localhost:8080/api/catalogos');

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText || 'Falha ao buscar catálogos'}`);
        }

        const contentType = response.headers.get("content-type");
        if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
          setCatalogos([]);
        } else {
          const data = await response.json();
          setCatalogos(data || []);
        }
      } catch (err) {
        if (err.message !== 'Não autorizado') {
          console.error("Erro ao buscar os catálogos:", err);
          setError(err.message || 'Ocorreu um erro ao carregar os catálogos.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogosDoBackend();
  }, []); 


  const handleCatalogoClick = (idCatalogo) => {
    navigate(`/catalogo-detalhes/${idCatalogo}`);
    console.log("Clicou no catálogo com ID:", idCatalogo);
  };

  if (loading) {
    return <div className="catalogo"><h1 className="titulo">Catálogo de Capacitações</h1><p className="status-message">Carregando catálogos...</p></div>;
  }

  if (error) {
    return <div className="catalogo"><h1 className="titulo">Catálogo de Capacitações</h1><p className="status-message error-message">Erro ao carregar: {error}</p></div>;
  }

  return (
    <div className="catalogo">
      <h1 className="titulo">Catálogo de Capacitações</h1>
      {catalogos.length === 0 ? (
        <p className="status-message">Nenhum catálogo disponível no momento.</p>
      ) : (
        catalogos.map((categoria) => (
          <div key={categoria.id} className="categoria">
            <h2>{categoria.nome}</h2>
            <div className="cursos-row">
              <div
                className="curso-card"
                onClick={() => handleCatalogoClick(categoria.id)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={`https://placehold.co/250x140/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${encodeURIComponent(categoria.icone || categoria.nome || 'Catálogo')}`} 
                  alt={categoria.nome} 
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/250x140/CCCCCC/FFFFFF/png?text=Erro'; }}
                />
                <p>{categoria.nome}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Catalogo;
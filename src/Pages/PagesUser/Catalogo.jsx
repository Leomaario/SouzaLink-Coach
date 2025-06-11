import React, { useState, useEffect } from 'react';
 import '@styles/Catalogo.css'; 
import { useNavigate } from 'react-router-dom';

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
        const response = await fetch('http://localhost:8080/api/catalogos'); // Nossa API de catálogos

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
        console.error("Erro ao buscar os catálogos:", err);
        setError(err.message || 'Ocorreu um erro ao carregar os catálogos.');
        setCatalogos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogosDoBackend();
  }, []); // Array vazio para executar apenas uma vez na montagem

  // A função handleCursoClick agora deve lidar com o ID de um catálogo.
  // Você pode querer que ela navegue para uma página de detalhes do catálogo.
  const handleCatalogoClick = (idCatalogo) => {
    // Exemplo: navegar para uma rota que mostra detalhes/vídeos de um catálogo específico
    navigate(`/catalogo-detalhes/${idCatalogo}`);
    // Ou, se a intenção era ir para o primeiro vídeo/curso do catálogo:
    // navigate(`/curso/${primeiroCursoIdDoCatalogo}`); // Isso exigiria mais lógica
    console.log("Clicou no catálogo com ID:", idCatalogo);
  };

  if (loading) {
    return <div className="catalogo"><h1 className="titulo">Catálogo de Cursos</h1><p className="status-message">Carregando catálogos...</p></div>;
  }

  if (error) {
    return <div className="catalogo"><h1 className="titulo">Catálogo de Cursos</h1><p className="status-message error-message">Erro ao carregar: {error}</p></div>;
  }

  return (
    <div className="catalogo">
      <h1 className="titulo">Catálogo de Cursos</h1>
      {catalogos.length === 0 ? (
        <p className="status-message">Nenhum catálogo disponível no momento.</p>
      ) : (
        catalogos.map((categoria) => ( // 'categoria' aqui é um objeto de catálogo do backend
          <div key={categoria.id} className="categoria"> {/* Usando categoria.id como chave */}
            <h2>{categoria.nome}</h2> {/* Usando categoria.nome */}
            <div className="cursos-row">
              {/* A API /api/catalogos não retorna os 'cursos' (vídeos) dentro de cada catálogo.
                Precisaríamos de outra chamada à API para buscar os vídeos de cada 'categoria.id'.
                Por enquanto, vamos simular ou remover esta parte.
                Exemplo: Se você tivesse um campo 'videos' na sua entidade Catalogo populado:
                {categoria.videos && categoria.videos.map(video => ( ... card do video ...))}

                Ou, por agora, podemos mostrar um card simples para o próprio catálogo,
                ou um placeholder indicando que os vídeos seriam carregados aqui.
              */}
              <div
                className="curso-card" // Reutilizando sua classe, mas agora representa o catálogo
                onClick={() => handleCatalogoClick(categoria.id)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={`https://placehold.co/250x140/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${encodeURIComponent(categoria.icone || categoria.nome || 'Catálogo')}`} 
                  alt={categoria.nome} 
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/250x140/CCCCCC/FFFFFF/png?text=Erro'; }}
                />
                <p>{categoria.nome}</p>
                {/* <p>{categoria.descricao || 'Sem descrição'}</p> */}
                {/* Você pode adicionar mais informações do catálogo aqui se desejar */}
              </div>
              {/* Se você quiser mostrar uma lista de vídeos aqui dentro, precisaria de outro fetch */}
              {/* <p className="status-message">Vídeos deste catálogo seriam carregados aqui.</p> */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Catalogo;

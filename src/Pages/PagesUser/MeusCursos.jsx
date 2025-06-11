import React, { useState, useEffect } from 'react';
 import '@styles/MeusCursos.css';
import { Link } from 'react-router-dom';
// Componente para um card de curso individual
const CursoCard = ({ curso }) => (
  <div className='curso-card'>
    {/* O Link agora leva para a rota de visualização do curso/vídeo */}
    <Link to={`/curso/${curso.id}`} className="curso-link">
      <img 
        // Para a miniatura (thumbnail), o ideal seria ter uma imagem específica.
        // Como o backend nos dá um caminho de arquivo de vídeo, usamos um placeholder.
        src={`https://placehold.co/300x170/007bff/FFFFFF/png?text=${encodeURIComponent(curso.titulo)}`} 
        alt={`Capa do curso ${curso.titulo}`} 
        className='curso-thumbnail'
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x170/CCCCCC/FFFFFF/png?text=Erro+Img'; }}
      />
      <div className='curso-info'>
        <h3 className='curso-titulo'>{curso.titulo}</h3>
        {/* Podemos mostrar a duração que vem do backend, se existir */}
        <p className='curso-aulas'>{curso.duracaoSegundos ? `${Math.ceil(curso.duracaoSegundos / 60)} min` : 'Duração N/A'}</p>
        
        {/* A barra de progresso, por enquanto, é visual e não funcional */}
        <div className='progresso-container'>
          <div 
            className='progresso-bar' 
            style={{ width: `0%` }} 
          ></div>
        </div>
        <span className='progresso-texto'>Começar a assistir</span>
      </div>
    </Link>
  </div>
);


export function MeusCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Botões de filtro (a lógica de filtrar ainda não está implementada)
  const [activeFilter, setActiveFilter] = useState('all');
  const filterButtons = [
    { id: 'all', label: 'Todos' },
    { id: 'progress', label: 'Em Andamento' },
    { id: 'completed', label: 'Concluídos' },
  ];

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Buscando os vídeos da nossa API
        const response = await fetch('http://localhost:8080/api/videos'); 
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
          setCursos([]);
        } else {
          const data = await response.json();
          setCursos(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Não foi possível carregar os cursos. O backend está rodando?");
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []); // Roda só uma vez

  // --- Renderização ---
  if (loading) {
    return <div className="container-meus-cursos"><h1 id='title-curso'>Meus Cursos</h1><p className="status-message">Carregando...</p></div>;
  }

  if (error) {
    return <div className="container-meus-cursos"><h1 id='title-curso'>Meus Cursos</h1><p className="status-message error-message">{error}</p></div>;
  }

  return (
    <div className="container-meus-cursos">
      <h1 id='title-curso'>Meus Cursos</h1>
      <div className='filter-buttons'>
        {filterButtons.map((filtro) => (
          <button
            key={filtro.id}
            className={activeFilter === filtro.id ? 'active' : ''}
            onClick={() => setActiveFilter(filtro.id)}
          >
            {filtro.label}
          </button>
        ))}
      </div>

      <div className='container-cursos'>
        {cursos.length === 0 ? (
          <p className="status-message">Nenhum curso encontrado.</p>
        ) : (
          <div className='cards-wrapper'>
            {cursos.map((curso) => (
              <CursoCard key={curso.id} curso={curso} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeusCursos;

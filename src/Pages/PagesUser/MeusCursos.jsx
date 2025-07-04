import React, { useState, useEffect } from 'react';
import '@styles/MeusCursos.css';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';

// --- COMPONENTE DO CARD ATUALIZADO ---
const CursoCard = ({ curso }) => (
    <div className='curso-card'>
        <Link to={`/curso/${curso.id}`} className="curso-link">
            <img 
                src={curso.caminhoThumbnail ? `http://localhost:8080/media/${curso.caminhoThumbnail}` : `https://placehold.co/300x170/007bff/FFFFFF/png?text=${encodeURIComponent(curso.titulo)}`} 
                alt={`Capa do curso ${curso.titulo}`} 
                className='curso-thumbnail'
            />
            <div className='curso-info'>
                <h3 className='curso-titulo'>{curso.titulo}</h3>
                {/* Opcional: A duração só aparece se existir */}
                {curso.duracaoSegundos && (
                    <p className='curso-aulas'>{`${Math.ceil(curso.duracaoSegundos / 60)} min`}</p>
                )}
                
                {/* Barra de progresso sempre 100% para cursos concluídos */}
                <div className='progresso-container'>
                    <div className='progresso-bar' style={{ width: `100%` }}></div>
                </div>
                <span className='progresso-texto concluido'>Concluído ✔️</span>
            </div>
        </Link>
    </div>
);

export function MeusCursos() {
    const [cursosConcluidos, setCursosConcluidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCursosConcluidos = async () => {
            try {
                setLoading(true);
                setError(null);
                // --- CHAMANDO A NOVA ROTA DO BACKEND ---
                const response = await apiFetch('http://localhost:8080/api/progresso/meus-concluidos');
                
                if (!response.ok) {
                    throw new Error('Falha ao carregar os cursos concluídos.');
                }
                
                const data = await response.json();
                setCursosConcluidos(data || []);

            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    setError("Não foi possível carregar os seus cursos.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCursosConcluidos();
    }, []);

    if (loading) return <div className="container-meus-cursos"><h1>Meus Cursos Concluídos</h1><p>A carregar...</p></div>;
    if (error) return <div className="container-meus-cursos"><h1>Meus Cursos Concluídos</h1><p>{error}</p></div>;

    return (
        <div className="container-meus-cursos">
            <h1>Meus Cursos Concluídos</h1>
            
            {/* Os botões de filtro foram removidos para simplificar, já que a página agora tem um foco único */}

            <div className='container-cursos'>
                {cursosConcluidos.length === 0 ? (
                    <p className="status-message">Você ainda não concluiu nenhum curso.</p>
                ) : (
                    <div className='cards-wrapper'>
                        {cursosConcluidos.map((curso) => (
                            <CursoCard key={curso.id} curso={curso} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MeusCursos;
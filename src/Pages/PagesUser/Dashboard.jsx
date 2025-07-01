import React, { useState, useEffect } from 'react';
import '@styles/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api'; // O nosso serviço de API

export default function Dashboard() {
    const navigate = useNavigate();

    // 1. Estados para guardar os dados que virão da API
    const [dashboardData, setDashboardData] = useState({
        cursoEmDestaque: null,
        totalCursos: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect para buscar os dados assim que o componente carrega
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Chamada para o novo endpoint que criámos no backend
                const response = await apiFetch('/api/user-dashboard/data');
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do dashboard.');
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    console.error("Erro no dashboard:", err);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // O array vazio [] garante que roda só uma vez

    // Renderização para o estado de carregamento
    if (loading) {
        return <div className="dashboard-container"><h1>Dashboard</h1><p className="status-message">A carregar...</p></div>;
    }

    // Renderização para o estado de erro
    if (error) {
        return <div className="dashboard-container"><h1>Dashboard</h1><p className="status-message error-message">Erro: {error}</p></div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                {/* Lado Esquerdo */}
                <div className='container-left'>
                    <div className="card resumo-progresso">
                        <h2>Resumo do Progresso</h2>
                        {/* 3. Exibindo o total de cursos real */}
                        <p><strong>{dashboardData.totalCursos}</strong> cursos disponíveis na plataforma</p>
                        {/* As outras estatísticas precisam do sistema de progresso que vamos construir no futuro */}
                        <p><strong>--%</strong> média de conclusão</p>
                        <p><strong>--</strong> em andamento</p>
                    </div>

                    <div className="card lembretes">
                        <h2>Próximos prazos / Lembretes</h2>
                        <ul>
                            <li>Funcionalidade de lembretes em breve!</li>
                        </ul>
                    </div>
                </div>

                {/* Lado Direito */}
                <div className='container-right'>
                    {/* 4. O "Curso em Destaque" agora é dinâmico */}
                    {dashboardData.cursoEmDestaque ? (
                        <div className="card curso-destaque">
                            <h2>Curso em Destaque</h2>
                            <div className="curso-info">
                                <img src={`https://placehold.co/60x60/70AD47/FFFFFF/png?text=${dashboardData.cursoEmDestaque.titulo.substring(0, 2)}`} alt={dashboardData.cursoEmDestaque.titulo} />
                                <div>
                                    <strong>{dashboardData.cursoEmDestaque.titulo}</strong>
                                    <p>Este é o curso mais recente na plataforma!</p>
                                </div>
                            </div>
                            <button
                                className="botao-assistir"
                                onClick={() => navigate(`/curso/${dashboardData.cursoEmDestaque.id}`)}
                            >
                                Começar a assistir
                            </button>
                        </div>
                    ) : (
                        <div className="card curso-destaque">
                            <h2>Curso em Destaque</h2>
                            <p>Nenhum curso para destacar no momento.</p>
                        </div>
                    )}
                    
                    <div className="card certificados">
                        <h2>Certificados conquistados recentemente</h2>
                        <div className="certificados-lista">
                           <p>Veja seus certificados na página <Link to="/MeusCertificados">Meus Certificados</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import '@styles/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../Services/api';
import { Book, CheckCircleFill, ClockHistory, Award, ArrowRight } from 'react-bootstrap-icons';



function getYouTubeThumbnail(youtubeUrl) {
    if (!youtubeUrl) return null;
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
export default function Dashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        cursoEmDestaque: null,
        totalCursos: 0,
        cursosEmAndamento: 0,
        mediaConclusao: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    const apiFetch = (endpoint, options = {}) => fetch('https://api-e-learning-gjnd.onrender.com/api/user-dashboard/data', {
        headers: headers

    })


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await apiFetch('/api/user-dashboard/data');
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do dashboard.');
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="dashboard-container"><h1>Dashboard</h1><p className="status-message">A carregar...</p></div>;
    if (error) return <div className="dashboard-container"><h1>Dashboard</h1><p className="status-message error-message">Erro: {error}</p></div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-grid">
                <div className='container-left'>
                    <div className="card resumo-progresso">
                        <h2>Resumo do Progresso</h2>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <Book className="stat-icon" />
                                <div>
                                    <span className="stat-value">{dashboardData.totalCursos}</span>
                                    <span className="stat-label">Cursos Disponíveis</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <ClockHistory className="stat-icon" />
                                <div>
                                    <span className="stat-value">{dashboardData.cursosEmAndamento}</span>
                                    <span className="stat-label">Em Andamento</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <CheckCircleFill className="stat-icon" />
                                <div>
                                    <span className="stat-value">{dashboardData.mediaConclusao}%</span>
                                    <span className="stat-label">Média de Conclusão</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="card lembretes">
                        <h2>Lembretes / Próximos Passos</h2>
                        <ul>
                            <li>Precisa de Ajuda? Abra um chamado para Ti atraves do GLPI</li>
                            <li>Explore o novo catálogo de "Impressoras".</li>
                            <li>Não esqueça de marcar como concluido ao finalizar um video.</li>
                        </ul>
                    </div>
                </div>
                <div className='container-right'>
                    {dashboardData.cursoEmDestaque ? (
                        <div className="card curso-destaque">
                            <img
                                src={getYouTubeThumbnail(dashboardData.cursoEmDestaque.urlDoVideo)}
                                alt={dashboardData.cursoEmDestaque.titulo}
                                className="curso-thumbnail"
                            />

                            <div className="destaque-info">
                                <h3>Curso em Destaque</h3>
                                <h2>{dashboardData.cursoEmDestaque.titulo}</h2>
                                <p>Este é o curso mais recente na plataforma! Comece já a aprender.</p>
                                <button className="botao-assistir" onClick={() => navigate(`/curso/${dashboardData.cursoEmDestaque.id}`)}>
                                    Continuar assistindo <ArrowRight />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card curso-destaque"><h2>Nenhum curso em destaque.</h2></div>
                    )}
                    <div className="card certificados">
                        <h2><Award /> Certificados Recentes</h2>
                        <p>Os seus certificados aparecerão aqui assim que concluir os catálogos.</p>
                        <button onClick={() => navigate('/MeusCertificados')} className="botao-ver-todos">Ver todos</button>
                    </div>
                    <div className="card dicas">
                        <h2>Dicas e Truques</h2>
                        <ul>
                            <li>Complete as capacitações para desbloquear certificados.</li>
                        </ul>
                        <button onClick={() => navigate('/Catalogo')} className="botao-ver-todos">Ver todos</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
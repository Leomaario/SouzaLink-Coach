import React, { useState, useEffect } from 'react';
import '../../src/Styles/Css-Admin/PainelAdmin.css';
import { BsBookFill, BsPeopleFill, BsGraphUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../Services/api';

function PainelAdmin() {
    const navigate = useNavigate();

    // Estados para os dados, loading e erro
    const [stats, setStats] = useState({ totalCursos: 0, totalUsuarios: 0, totalRelatorios: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Usando nosso serviço de API para uma chamada autenticada
                const response = await apiFetch('http://localhost:8080/api/dashboard/stats');
                if (!response.ok) {
                    throw new Error('Falha ao carregar estatísticas do painel.')
                    ;
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                if (err.message !== 'Não autorizado') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Renderização de estado de carregamento
    if (loading) {
        return (
            <div className="admin-dashboard">
                <h1 className="admin-titulo">Painel do Administrador</h1>
                <p className="status-message">A carregar dados...</p>
            </div>
        );
    }

    // Renderização de estado de erro
    if (error) {
        return (
            <div className="admin-dashboard">
                <h1 className="admin-titulo">Painel do Administrador</h1>
                <p className="status-message error-message">Erro ao carregar o painel: {error}</p>
            </div>
        );
    }

    // Renderização principal
    return (
        <div className="admin-dashboard">
            <h1 className="admin-titulo">Painel do Administrador</h1>

            {/* Visão Geral com dados dinâmicos */}
            <div className="admin-visao-geral">
                <div className="visao-card">
                    <BsBookFill className="visao-icon" />
                    <div>
                        <h3>Cursos Ativos</h3>
                        <p>{stats.totalCursos} cursos</p>
                    </div>
                </div>
                <div className="visao-card">
                    <BsPeopleFill className="visao-icon" />
                    <div>
                        <h3>Usuários</h3>
                        <p>{stats.totalUsuarios} usuários</p>
                    </div>
                </div>
                <div className="visao-card">
                    <BsGraphUp className="visao-icon" />
                    <div>
                        <h3>Relatórios</h3>
                        <p>{stats.totalRelatorios} gerados</p>
                    </div>
                </div>
            </div>

            {/* Ações do admin completas */}
            <div className="admin-cards-container">
                <div className="admin-card" onClick={() => navigate('/AdicionarCurso')}>
                    <i className="bi bi-plus-square-fill icon"></i>
                    <h2>Adicionar Curso</h2>
                    <p>Crie um novo curso com descrição, módulos e vídeos.</p>
                </div>

                <div className="admin-card" onClick={() => navigate('/CriarUsuario')}>
                    <i className="bi bi-person-plus-fill icon"></i>
                    <h2>Adicionar Usuário</h2>
                    <p>Cadastre colaboradores com permissões específicas.</p>
                </div>

                <div className="admin-card" onClick={() => navigate('/CriarRelatorio')}>
                    <i className="bi bi-bar-chart-line-fill icon"></i>
                    <h2>Criar Relatórios</h2>
                    <p>Gere relatórios personalizados de progresso e conclusão.</p>
                </div>

                <div className="admin-card" onClick={() => navigate('/EmitirRelatorios')}>
                    <i className="bi bi-file-earmark-text icon"></i>
                    <h2>Emitir Relatorios</h2>
                    <p>Emita Relatorios personalizados.</p>
                </div>
                
                <div className="admin-card" onClick={() => navigate('/CriarCatalogo')}>
                    <i className="bi bi-file-earmark-plus icon"></i>
                    <h2>Criar Catálogo</h2>
                    <p>Organize cursos por categorias e publique no sistema.</p>
                </div>
            </div>
        </div>
    );
}

export default PainelAdmin;
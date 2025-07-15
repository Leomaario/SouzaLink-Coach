import React, { useState, useEffect } from 'react';
import '../../src/Styles/Css-Admin/PainelAdmin.css';
import { BsBookFill, BsPeopleFill, BsGraphUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../Services/api';

function PainelAdmin() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalCursos: 0, totalUsuarios: 0, totalRelatorios: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiFetch('/dashboard/stats');
                if (!response.ok) throw new Error('Falha ao carregar estatísticas do painel.');
                const data = await response.json();
                setStats(data);
            } catch (err) {
                if (err.message !== 'Não autorizado') setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <h1 className="admin-titulo">Painel do Administrador</h1>
                <p className="status-message">A carregar dados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <h1 className="admin-titulo">Painel do Administrador</h1>
                <p className="status-message error-message">Erro ao carregar o painel: {error}</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1 className="admin-titulo">Painel do Administrador</h1>
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
            <div className="admin-cards-container">
                <div className="admin-card" onClick={() => navigate('/CursosAdmin')}>
                    <i className="bi bi-plus-square-fill icon"></i>
                    <h2>Adicionar Curso</h2>
                    <p>Crie um novo curso com descrição, módulos e vídeos.</p>
                </div>
                <div className="admin-card" onClick={() => navigate('/Usuario')}>
                    <i className="bi bi-person-plus-fill icon"></i>
                    <h2>Adicionar Usuário</h2>
                    <p>Cadastre colaboradores com permissões específicas.</p>
                </div>
                <div className="admin-card" onClick={() => navigate('/EditarRelatorio')}>
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
                <div className="admin-card" onClick={() => navigate('/GerenciarUsuarios')}>
                    <i className="bi bi-pencil-square icon"></i>
                    <h2>Gerenciar Usuário</h2>
                    <p>Atualize informações de usuários existentes.</p>
                </div>
                <div className="admin-card" onClick={() => navigate('/GerenciarCursos')}>
                    <i className="bi bi-gear-fill icon"></i>
                    <h2>Gerenciar Cursos</h2>
                    <p>Atualize, publique ou remova cursos do catálogo.</p>
                </div>
                <div className="admin-card" onClick={() => navigate('/GerenciarCatalogo')}>
                    <i className="bi bi-folder-fill icon"></i>
                    <h2>Gerenciar Catálogo</h2>
                    <p>Organize e edite os catálogos de cursos.</p>
                </div>
            </div>
        </div>
    );
}

export default PainelAdmin;
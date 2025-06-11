import React from 'react';
import '../../src/Styles/Css-Admin/PainelAdmin.css';
import { BsBookFill, BsPeopleFill, BsGraphUp } from 'react-icons/bs';
import { Link, Navigate, useNavigate } from 'react-router-dom';



function PainelAdmin() {
    const Navigate = useNavigate();
  return (
    <div className="admin-dashboard">
      <h1 className="admin-titulo">Painel do Administrador</h1>

      {/* Visão Geral */}
      <div className="admin-visao-geral">
        <div className="visao-card">
          <BsBookFill className="visao-icon" />
          <div>
            <h3>Cursos Ativos</h3>
            <p>12 cursos</p>
          </div>
        </div>
        <div className="visao-card">
          <BsPeopleFill className="visao-icon" />
          <div>
            <h3>Usuários</h3>
            <p>58 usuários</p>
          </div>
        </div>
        <div className="visao-card">
          <BsGraphUp className="visao-icon" />
          <div>
            <h3>Relatórios</h3>
            <p>8 gerados</p>
          </div>
        </div>
      </div>

      {/* Ações do admin */}
      <div className="admin-cards-container">
        <div className="admin-card" onClick={() => Navigate('/CursosAdmin')}>
          <i className="bi bi-plus-square-fill icon"></i>
          <h2>Adicionar Curso</h2>
          <p>Crie um novo curso com descrição, módulos e vídeos.</p>
        </div>

        <div className="admin-card" onClick={() => Navigate('/Usuario')}>
          <i className="bi bi-person-plus-fill icon"></i>
          <h2>Adicionar Usuário</h2>
          <p>Cadastre colaboradores com permissões específicas.</p>
        </div>

        <div className="admin-card" onClick={() => Navigate('/EditarRelatorio')}>
          <i className="bi bi-bar-chart-line-fill icon"></i>
          <h2>Criar Relatórios</h2>
          <p>Gere relatórios personalizados de progresso e conclusão.</p>
        </div>

        <div className="admin-card" onClick={() => Navigate('/EmitirRelatorios')}>
          <i className="bi bi-file-earmark-text icon"></i>
          <h2>Emitir Relatorios</h2>
          <p>Emita Relatorios personalizados .</p>
        </div>

        
        <div className="admin-card" onClick={() => Navigate('/CriarCatalogo')}>
          <i className="bi bi-file-earmark-plus icon"></i>
          <h2>Criar Catálogo</h2>
          <p>Organize cursos por categorias e publique no sistema.</p>
        </div>
      </div>
    </div>
  );
}

export default PainelAdmin;

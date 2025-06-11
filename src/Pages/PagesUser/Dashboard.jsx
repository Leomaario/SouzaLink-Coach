import React from 'react';
import '@styles/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const curso = {
    id: 'css-avancado',
    nome: 'CSS Avançado',
    progresso: 75,
    imagem: 'https://placehold.co/60x60/70AD47/FFFFFF/png?text=CSS',
  };

  const handleCursoClick = (id) => {
    navigate(`/curso/${id}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        {/* Lado Esquerdo */}
        <div className='container-left'>
          <div className="card resumo-progresso">
            <h2>Resumo do Progresso</h2>
            <p><strong>5</strong> cursos</p>
            <p><strong>67%</strong> média de conclusão</p>
            <p><strong>2</strong> em andamento</p>
          </div>

          <div className="card lembretes">
            <h2>Próximos prazos / Lembretes</h2>
            <ul>
              <li>
                Você tem um quiz pendente no curso <Link to="/curso/js-moderno">JavaScript Moderno</Link>
              </li>
              <li>
                O módulo 3 do curso <Link to="/curso/react">Introdução ao React</Link> vence amanhã
              </li>
            </ul>
          </div>
        </div>

        {/* Lado Direito */}
        <div className='container-right'> 
          <div className="card curso-destaque">
            <h2>Curso em Destaque</h2>
            <div className="curso-info">
              <img src={curso.imagem} alt={curso.nome} />
              <div>
                <strong>{curso.nome}</strong>
                <div className="progress-bar">
                  <div style={{ width: `${curso.progresso}%` }} className="progress" />
                </div>
                <p>{curso.progresso}% em andamento</p>
              </div>
            </div>
            <button 
              className="botao-assistir"
              onClick={() => handleCursoClick(curso.id)}
              style={{ cursor: 'pointer' }}
            >
              Continuar assistindo
            </button>
          </div>

          <div className="card certificados">
            <h2>Certificados conquistados recentemente</h2>
            <div className="certificados-lista">
              <div className="certificado">
                <img src="https://placehold.co/40x40/007bff/fff?text=JS" alt="JS" />
                <p>JavaScript Moderno<br /><Link to="/certificados/js">Visualizar certificado</Link></p>
              </div>
              <div className="certificado">
                <img src="https://placehold.co/40x40/007bff/fff?text=RE" alt="React" />
                <p>Introdução ao React<br /><Link to="/certificados/react">Visualizar certificado</Link></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@styles/Sidebar.css';


function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="hamburger" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <img src="./public/imgs/logo.png" id="logo" alt="Logo" />
        <div className="menu">
          <nav>
            <Link to={"/"} onClick={toggleSidebar}><i className="bi bi-house"></i>Painel</Link>
            <Link to="/MeusCursos" onClick={toggleSidebar}><i className="bi bi-book"></i>Meus Cursos</Link>
            <Link to="/CriarCatalogo" onClick={toggleSidebar}><i className="bi bi-cast"></i>Criar Catalogo</Link>
            <Link to="/MeusCursos" onClick={toggleSidebar}><i className="bi bi-backpack3"></i>Adicionar Curso</Link>
            <Link to="/Catalogo" onClick={toggleSidebar}><i className="bi bi-funnel-fill"></i>Criar Relatorio</Link>
            <Link to="/MeusCertificados" onClick={toggleSidebar}><i className="bi bi-envelope-check"></i>Criar Usuario</Link>
          </nav>
          <div className="menu-separator">
            <Link to="/EditProfile" id='meuperfil' onClick={toggleSidebar}>
              <i className="bi bi-person-circle"></i>Meu Perfil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

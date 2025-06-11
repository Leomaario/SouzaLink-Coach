import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@styles/Sidebar.css'; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger');
      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        hamburger &&
        !hamburger.contains(event.target)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <button className="hamburger" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <img src="./public/imgs/logo.png" id="logo" alt="Logo" />
        <div className="menu">
          <nav>
            <Link to="/" onClick={closeSidebar}><i className="bi bi-cast"></i>Dashboard</Link>
            <Link to="/MeusCursos" onClick={closeSidebar}><i className="bi bi-backpack3"></i>Meus Cursos</Link>
            <Link to="/Catalogo" onClick={closeSidebar}><i className="bi bi-funnel-fill"></i>Catálogo de Cursos</Link>
            <Link to="/MeusCertificados" onClick={closeSidebar}><i className="bi bi-envelope-check"></i>Meus Certificados</Link>
            <Link to="/PainelAdmin" onClick={closeSidebar}><i className="bi bi-heart-fill"></i>Painel Admin</Link>
          </nav>
          <div className="menu-separator">
            <Link to="/EditProfile" id='meuperfil' onClick={closeSidebar}>
              <i className="bi bi-person-circle"></i>Meu Perfil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

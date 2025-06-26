import React, { useState, useEffect } from 'react';
// 1. IMPORTAMOS O useNavigate
import { Link, useNavigate } from 'react-router-dom';
import '@styles/Sidebar.css'; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  // 2. INICIALIZAMOS O useNavigate
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };
  
  // 3. ADICIONAMOS A FUNÇÃO DE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Seu código para fechar o menu ao clicar fora (mantido, está perfeito)
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
        <img src="/imgs/logo.png" id="logo" alt="Logo" /> {/* Recomendo usar /imgs/... para caminho absoluto */}
        <div className="menu">
          <nav>
            <Link to="/" onClick={closeSidebar}><i className="bi bi-cast"></i>Dashboard</Link>
            <Link to="/MeusCursos" onClick={closeSidebar}><i className="bi bi-backpack3"></i>Meus Cursos</Link>
            <Link to="/Catalogo" onClick={closeSidebar}><i className="bi bi-funnel-fill"></i>Catálogo de Capacitações</Link>
            <Link to="/MeusCertificados" onClick={closeSidebar}><i className="bi bi-envelope-check"></i>Meus Certificados</Link>
            <Link to="/PainelAdmin" onClick={closeSidebar}><i className="bi bi-heart-fill"></i>Painel Admin</Link>
          </nav>
          <div className="menu-separator">
            <Link to="/EditProfile" id='meuperfil' onClick={closeSidebar}>
              <i className="bi bi-person-circle"></i>Meu Perfil
            </Link>
          </div>
        </div>
        
        {/* 4. ADICIONAMOS UM RODAPÉ COM O BOTÃO DE SAIR */}
        <div className="sidebar-footer">
            <button className="logout-button" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                <span>Sair</span>
            </button>
        </div>

      </div>
    </>
  );
}

export default Sidebar;
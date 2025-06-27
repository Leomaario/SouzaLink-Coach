import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles/Sidebar.css'; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  // NOVO ESTADO: para guardar os dados do usuário logado
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Efeito para carregar os dados do usuário do localStorage UMA VEZ
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Parseia o JSON e guarda o objeto do usuário no estado
      setCurrentUser(JSON.parse(userString));
    }
  }, []); // O array vazio [] garante que isso rode só na montagem do componente

  // Efeito para fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger');
      if (sidebar && !sidebar.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {!isOpen && (
        <button className="hamburger" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <img src="/imgs/logo.png" id="logo" alt="Logo" />
        <div className="menu">
          <nav>
            {/* Seus links de navegação aqui... */}
            <Link to="/dashboard" onClick={closeSidebar}><i className="bi bi-cast"></i>Dashboard</Link>
            <Link to="/MeusCursos" onClick={closeSidebar}><i className="bi bi-backpack3"></i>Meus Cursos</Link>
            <Link to="/Catalogo" onClick={closeSidebar}><i className="bi bi-funnel-fill"></i>Catálogo</Link>
            <Link to="/MeusCertificados" onClick={closeSidebar}><i className="bi bi-envelope-check"></i>Certificados</Link>
            <Link to="/PainelAdmin" onClick={closeSidebar}><i className="bi bi-heart-fill"></i>Painel Admin</Link>
          </nav>
        </div>
        
        {/* --- NOVA SEÇÃO DE PERFIL E LOGOUT --- */}
        <div className="sidebar-footer">
          <Link to="/EditProfile" className="user-profile-link" onClick={closeSidebar}>
            <i className="bi bi-person-circle"></i>
            <div className="user-info">
              <span className="user-name">{currentUser?.usuario || 'Carregando...'}</span>
              <span className="user-email">{currentUser?.email}</span>
            </div>
          </Link>
          <button onClick={handleLogout} className="logout-icon-button" title="Sair">
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
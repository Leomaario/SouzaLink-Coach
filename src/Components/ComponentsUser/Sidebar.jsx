import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles/Sidebar.css';
import { 
    HouseDoorFill, BookFill, FunnelFill, EnvelopeCheck, PersonWorkspace, 
    Cast, Backpack3, PersonPlusFill, FileEarmarkBarGraph, PersonCircle, BoxArrowRight 
} from 'react-bootstrap-icons';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            setUser(JSON.parse(userDataString));
        }
        
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };
        
        // Define o estado inicial da sidebar com base na largura da tela
        handleResize(); 
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsOpen(!isOpen);
        }
    };
  
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <>
            <button className="hamburger" onClick={toggleSidebar}>
                <i className="bi bi-list"></i>
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src="/imgs/logo.png" id="logo" alt="Logo" />
                </div>
                <div className="menu">
                    <nav>
                        <Link to="/dashboard" onClick={toggleSidebar}><HouseDoorFill /><span>Dashboard</span></Link>
                        <Link to="/MeusCursos" onClick={toggleSidebar}><BookFill /><span>Meus Cursos</span></Link>
                        <Link to="/Catalogo" onClick={toggleSidebar}><FunnelFill /><span>Catálogo</span></Link>
                        <Link to="/MeusCertificados" onClick={toggleSidebar}><EnvelopeCheck /><span>Certificados</span></Link>
                        
                        {isAdmin && (
                            <>
                                <div className="admin-divider"></div>
                                <h2 className='title-adm'>Atalhos Administrativos</h2>
                                <Link to="/PainelAdmin" onClick={toggleSidebar}><PersonWorkspace /><span>Painel Admin</span></Link>
                                <Link to="/GerenciarCatalogos" onClick={toggleSidebar}><Cast /><span>Gerir Catálogos</span></Link>
                                <Link to="/CursosAdmin" onClick={toggleSidebar}><Backpack3 /><span>Adicionar Curso</span></Link>
                                <Link to="/GerenciarUsuarios" onClick={toggleSidebar}><PersonPlusFill /><span>Gerir Utilizadores</span></Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <Link to="/EditProfile" className="user-profile-link" onClick={toggleSidebar}>
                        <PersonCircle className="user-avatar" />
                        <div className="user-info">
                            <span className="user-name">{user?.usuario || 'Utilizador'}</span>
                            <span className="user-email">{user?.email || ''}</span>
                        </div>
                    </Link>
                    <button className="logout-icon-button" onClick={handleLogout} title="Sair">
                        <BoxArrowRight />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
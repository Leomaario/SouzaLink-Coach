import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles/Sidebar.css';
import { 
    List, // Ícone para o hamburger
    HouseDoorFill, BookFill, FunnelFill, EnvelopeCheck, PersonWorkspace, 
    Cast, Backpack3, PersonPlusFill, FileEarmarkBarGraph, PersonCircle, BoxArrowRight 
} from 'react-bootstrap-icons';

function Sidebar() {
    // Estado para controlar se a sidebar está aberta ou fechada
    const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Refs para "sentir" os cliques fora dos elementos
    const sidebarRef = useRef(null);
    const hamburgerRef = useRef(null);

    // Efeito para buscar dados do utilizador e adicionar "ouvintes" de eventos
    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            setUser(JSON.parse(userDataString));
        }
        
        // Função para fechar a sidebar se o clique for fora dela
        const handleClickOutside = (event) => {
            if (isOpen &&
                sidebarRef.current && 
                !sidebarRef.current.contains(event.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target)
            ) {
                // Só fecha se o clique for fora da sidebar E fora do botão hamburger
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // Depende do estado 'isOpen' para funcionar corretamente

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    // Função para abrir/fechar a sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
  
    // Função para o logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <>
            {/* --- O BOTÃO HAMBURGER SÓ APARECE SE A SIDEBAR ESTIVER FECHADA --- */}
            {!isOpen && (
                <button className="hamburger" onClick={toggleSidebar} ref={hamburgerRef}>
                    <List />
                </button>
            )}

            {/* A div da sidebar agora tem a nossa ref para detetar cliques */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div className="sidebar-header">
                    <img src="/imgs/logo.png" id="logo" alt="Logo" />
                </div>
                <div className="menu">
                    <nav>
                        {/* Links principais */}
                        <Link to="/dashboard" onClick={toggleSidebar}><HouseDoorFill /><span>Dashboard</span></Link>
                        <Link to="/MeusCursos" onClick={toggleSidebar}><BookFill /><span>Meus Cursos</span></Link>
                        <Link to="/Catalogo" onClick={toggleSidebar}><FunnelFill /><span>Catálogo</span></Link>
                        <Link to="/MeusCertificados" onClick={toggleSidebar}><EnvelopeCheck /><span>Certificados</span></Link>
                        
                        {/* Links que só o Admin vê */}
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
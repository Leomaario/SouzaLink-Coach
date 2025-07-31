import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles/Sidebar.css';
import {
    // 1. ÍCONES DO TEMA ADICIONADOS AQUI
    SunFill,
    MoonFill,
    List,
    HouseDoorFill,
    BookFill,
    FunnelFill,
    EnvelopeCheck,
    PersonWorkspace,
    Cast,
    Backpack3,
    PersonPlusFill,
    FileEarmarkBarGraph,
    PersonCircle,
    BoxArrowRight
} from 'react-bootstrap-icons';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const hamburgerRef = useRef(null);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // --- LÓGICA SEPARADA EM useEffects ---

    // useEffect para cuidar apenas do TEMA
    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // useEffect para buscar dados iniciais (só roda uma vez)
    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            setUser(JSON.parse(userDataString));
        }
    }, []);

    // useEffect para cuidar do clique fora do menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
                if (window.innerWidth < 1024) {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // Depende apenas de 'isOpen'

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
            <button className={`hamburger ${isOpen ? 'is-active' : ''}`} onClick={toggleSidebar} ref={hamburgerRef}>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div className="sidebar-header">
                    <img src="/imgs/logo.png" id="logo" alt="Logo" />
                </div>
                <div className="menu">
                    <nav>
                        <Link to="/dashboard" onClick={handleLinkClick}><HouseDoorFill /><span>Dashboard</span></Link>
                        <Link to="/MeusCursos" onClick={handleLinkClick}><BookFill /><span>Minhas Capacitações</span></Link>
                        <Link to="/Catalogo" onClick={handleLinkClick}><FunnelFill /><span>Catálogo</span></Link>
                        <Link to="/MeusCertificados" onClick={handleLinkClick}><EnvelopeCheck /><span>Certificados</span></Link>

                        {isAdmin && (
                            <>
                                <div className="admin-divider"></div>
                                <h2 className='title-adm'>Atalhos Administrativos</h2>
                                <Link to="/PainelAdmin" onClick={handleLinkClick}><PersonWorkspace /><span>Painel Admin</span></Link>
                                <Link to="/gerenciarcatalogo" onClick={handleLinkClick}><Cast /><span>Gerir Catálogos</span></Link>
                                <Link to="/cursosadmin" onClick={handleLinkClick}><Backpack3 /><span>Adicionar Capacitação</span></Link>
                                <Link to="/gerenciarcursos" onClick={handleLinkClick}><PersonPlusFill /><span>Gerir Utilizadores</span></Link>
                            </>
                        )}
                    </nav>
                </div>
                <div className="sidebar-footer">
                    <Link to="/EditProfile" className="user-profile-link" onClick={handleLinkClick}>
                        <PersonCircle className="user-avatar" />
                        <div className="user-info">
                            <span className="user-name">{user?.usuario || 'Utilizador'}</span>
                            <span className="user-email">{user?.email || ''}</span>
                        </div>
                    </Link>

                    <button className="theme-toggle-button" onClick={toggleTheme} title={`Mudar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}>
                        {theme === 'light' ? <MoonFill /> : <SunFill />}
                    </button>

                    <button className="logout-icon-button" onClick={handleLogout} title="Sair">
                        <BoxArrowRight />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles/Sidebar.css';
import {
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

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            setUser(JSON.parse(userDataString));
        }

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
    }, [isOpen]);

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
                    <button className="logout-icon-button" onClick={handleLogout} title="Sair">
                        <BoxArrowRight />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
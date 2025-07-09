import React from 'react';
// <<<--- IMPORT NOVO: Outlet é usado para renderizar as rotas filhas ---<<<
import { Routes, Route, Outlet } from 'react-router-dom';
import './app.css'; // Certifique-se de que o caminho está correto

// --- Importe seu componente de Sidebar ---
import Sidebar from './Components/ComponentsUser/Sidebar'; // Verifique se este caminho está certo

// --- Importe suas páginas ---
import Login from './Pages/PagesUser/Login';
import Dashboard from './Pages/PagesUser/Dashboard';
import MeusCursos from './Pages/PagesUser/MeusCursos';
import Catalogo from './Pages/PagesUser/Catalogo';
import Certificados from './Pages/PagesUser/Certificados';
import PlayerCurso from './Pages/PagesUser/PlayerCurso';
import EditProfile from './Pages/PagesUser/EditProfile';


import NoteFoundPage from './Pages/NoteFoundPage'; // Página de erro 404

import PainelAdmin from './Pags-Admin/PainelAdmin';
import CriarCatalogo from './Pags-Admin/CriarCatalogo';
import CursosAdmin from './Pags-Admin/CursosAdmin';
import CriarUsuario from './Pags-Admin/Usuario';
import EditarRelatorio from './Pags-Admin/EditarRelatorio';
import EmitirRelatorios from './Pags-Admin/Relatorios';
import GerenciarUsuarios from './Pags-Admin/GerenciarUsuarios';
import GerenciarCursos from './Pags-Admin/GerenciarCurso';
import GerenciarCatalogo from './Pags-Admin/GerenciarCatalogo';


// --- Layout Principal (com Sidebar) ---
// Este componente "envolve" todas as páginas que devem ter a sidebar.
const MainLayout = () => {
  return (
    <div className="app-container"> {/* Container para organizar o layout */}
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* As rotas (Dashboard, etc.) serão renderizadas aqui dentro */}
      </main>
    </div>
  );
};

// --- Layout de Autenticação (sem Sidebar) ---
// Este componente "envolve" as páginas que NÃO devem ter a sidebar.
const AuthLayout = () => {
  return (
    <div className="auth-container"> {/* Container para a página de auth */}
      <Outlet /> {/* A rota de Login será renderizada aqui dentro */}
    </div>
  );
};


function App() {
  return (
    <Routes>
      {/* Grupo de rotas que NÃO TÊM a sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        {/* Se tiver uma página de "Esqueci a Senha", ela entraria aqui também */}
      </Route>

      {/* Grupo de rotas que TÊM a sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meuscursos" element={<MeusCursos />} />
        <Route path="/meuscertificados" element={<Certificados />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/favoritos" element={<h1>Favoritos</h1>} />
        <Route path="/curso/:id" element={<PlayerCurso />} />

        {/* Rotas do painel de administração */}
        <Route path="/paineladmin" element={<PainelAdmin />} />
        <Route path="/criarcatalogo" element={<CriarCatalogo />} />
        <Route path="/cursosadmin" element={<CursosAdmin/>} />
        <Route path="/usuario" element={<CriarUsuario/>}/>
        <Route path="/editarrelatorio" element={<EditarRelatorio/>} />
        <Route path="/emitirrelatorios" element={<EmitirRelatorios/>} />
        <Route path="/gerenciarusuarios" element={<GerenciarUsuarios />} />
        <Route path="/gerenciarcursos" element={<GerenciarCursos />}  /> 
        <Route path="/gerenciarcatalogo" element={<GerenciarCatalogo />} />
      </Route>
      
      {/* Rota de fallback para quando nenhuma rota acima for correspondida */}
      <Route path="*" element={<NoteFoundPage />} />
    </Routes>
  );
}

export default App;
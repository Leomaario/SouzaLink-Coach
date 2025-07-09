import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './app.css'; 


import Sidebar from './Components/ComponentsUser/Sidebar'; 


import Login from './Pages/PagesUser/Login';
import Dashboard from './Pages/PagesUser/Dashboard';
import MeusCursos from './Pages/PagesUser/MeusCursos';
import Catalogo from './Pages/PagesUser/Catalogo';
import Certificados from './Pages/PagesUser/Certificados';
import PlayerCurso from './Pages/PagesUser/PlayerCurso';
import EditProfile from './Pages/PagesUser/EditProfile';


import NoteFoundPage from './Pages/NoteFoundPage'; 

import PainelAdmin from './Pags-Admin/PainelAdmin';
import CriarCatalogo from './Pags-Admin/CriarCatalogo';
import CursosAdmin from './Pags-Admin/CursosAdmin';
import CriarUsuario from './Pags-Admin/Usuario';
import EditarRelatorio from './Pags-Admin/EditarRelatorio';
import EmitirRelatorios from './Pags-Admin/Relatorios';
import GerenciarUsuarios from './Pags-Admin/GerenciarUsuarios';
import GerenciarCursos from './Pags-Admin/GerenciarCurso';
import GerenciarCatalogo from './Pags-Admin/GerenciarCatalogo';



const MainLayout = () => {
  return (
    <div className="app-container"> 
      <Sidebar />
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
};


const AuthLayout = () => {
  return (
    <div className="auth-container"> 
      <Outlet /> 
    </div>
  );
};


function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meuscursos" element={<MeusCursos />} />
        <Route path="/meuscertificados" element={<Certificados />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/favoritos" element={<h1>Favoritos</h1>} />
        <Route path="/curso/:id" element={<PlayerCurso />} />
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
      <Route path="*" element={<NoteFoundPage />} />
    </Routes>
  );
}

export default App;
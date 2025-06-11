import './App.css'
import Sidebar from './Components/ComponentsUser/Sidebar'
import MeusCursos from './Pages/PagesUser/MeusCursos'
import { Routes, Route } from 'react-router-dom'
import React from 'react';
import './Styles/Global.css'
import Dashboard from './Pages/PagesUser/Dashboard';
import Catalogo from './Pages/PagesUser/Catalogo';
import Certificados from './Pages/PagesUser/Certificados';
import PlayerCurso from './Pages/PagesUser/PlayerCurso';
import EditProfile from './Pages/PagesUser/EditProfile';
import './Pags-Admin/PainelAdmin.jsx';
import PainelAdmin from './Pags-Admin/PainelAdmin.jsx';
import CriarCatalogo from './Pags-Admin/CriarCatalogo';
import CursosAdmin from './Pags-Admin/CursosAdmin';
import CriarUsuario from './Pags-Admin/Usuario';
import EditarRelatorio from './Pags-Admin/EditarRelatorio';
import EmitirRelatorios from './Pags-Admin/Relatorios';


function App() {

  return (
    <>
    <Sidebar />
    <main className='main-content'>
      <Routes>
          {/* Define as rotas do aplicativo */}
          {/* A rota raiz ("/") renderiza o componente Dashboard */}
          <Route path="/" element={<Dashboard />} />
       
          {/* Rotas para o usuário */}
          <Route path="/MeusCursos" element={<MeusCursos />} />
          <Route path="/MeusCertificados" element={<Certificados />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Catalogo" element={<h1><Catalogo /></h1>} />
          <Route path="/Favoritos" element={<h1>Favoritos</h1>} />

          {/* Rota para o player de curso, onde o ID do curso é passado como parâmetro */}
          <Route path="/curso/:id" element={<PlayerCurso />} />

          {/* Rotas para o painel de administração */}
          <Route path="/PainelAdmin" element={<PainelAdmin />} />
          <Route path="/CriarCatalogo" element={<CriarCatalogo />} />
          <Route path="/CursosAdmin" element={<CursosAdmin/>} />
          <Route path="/Usuario" element={<CriarUsuario/>}/>
          <Route path="/EditarRelatorio" element={<EditarRelatorio/>} />
          <Route path="/EmitirRelatorios" element={<EmitirRelatorios/>} />
          {/* Rota de fallback para quando nenhuma rota acima for correspondida */}
          <Route path="*" element={<h1>Página não encontrada, volte para pagina anterior</h1>} />
          
        </Routes>
    </main>
    </>
  )
}

export default App

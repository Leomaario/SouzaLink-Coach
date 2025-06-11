import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa o BrowserRouter
import App from './App.jsx';
import './index.css'; // Importa seu CSS global
import 'bootstrap-icons/font/bootstrap-icons.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolve o App com o BrowserRouter para ativar o react-router-dom */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

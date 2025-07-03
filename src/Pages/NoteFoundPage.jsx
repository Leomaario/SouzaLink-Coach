
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NoteFoundPage.css'; // Certifique-se de que o caminho está correto

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Página Não Encontrada</h2>
                <p className="error-message">
                    Opa! Parece que você tentou aceder a uma página que não existe ou foi movida.
                </p>
                <Link to="/dashboard" className="botao-voltar">
                    Voltar para o Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
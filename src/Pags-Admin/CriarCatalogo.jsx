import React, { useState } from 'react';
import '../../src/Styles/Css-Admin/CriarCatalogo.css';
import { apiFetch } from '../Services/api';

const CriarCatalogo = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMensagem('');

        const novoCatalogo = {
            nome,
            descricao,
        };

        try {
            const response = await apiFetch('/api/catalogos', {
                method: 'POST',
                body: JSON.stringify(novoCatalogo),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao criar o catálogo.');
            }

            setMensagem('Catálogo criado com sucesso!');
            setNome('');
            setDescricao('');
        } catch (error) {
            console.error('Erro no submit:', error);
            setMensagem(error.message || 'Ocorreu um erro. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="criar-catalogo-container">
            <h2>Criar Novo Catálogo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome do Catálogo</label>
                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Impressoras e Manutenção"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descreva o que este catálogo aborda..."
                    />
                </div>
                
                <button type="submit" className="botao-criar" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Catálogo'}
                </button>
                {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
            </form>
        </div>
    );
};

export default CriarCatalogo;
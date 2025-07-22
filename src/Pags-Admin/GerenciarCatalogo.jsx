import React, { useState, useEffect } from 'react';
import { apiFetch } from '../Services/api';
import { BsPencilSquare, BsTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import '../Styles/Css-Admin/GerenciarCatalogo.css';

const GerenciarCatalogos = () => {
    const [catalogos, setCatalogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catalogoEmEdicao, setCatalogoEmEdicao] = useState(null);

    useEffect(() => {
        const fetchCatalogos = async () => {
            try {
                const response = await apiFetch('/api/catalogos');
                if (!response.ok) throw new Error('Falha ao carregar catálogos.');
                const data = await response.json();
                setCatalogos(data);
            } catch (err) {
                if (err.message !== 'Não autorizado') setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogos();
    }, []);

    const handleDeletar = async (id, nome) => {
        if (window.confirm(`Tem a certeza que quer apagar o catálogo "${nome}"?`)) {
            try {
                await apiFetch(`/api/catalogos/${id}`, { method: 'DELETE' });
                setCatalogos(prev => prev.filter(c => c.id !== id));
            } catch (err) {
                alert('Falha ao apagar o catálogo.');
            }
        }
    };

    const handleAbrirModal = (catalogo = null) => {
        setCatalogoEmEdicao(
            catalogo
                ? { ...catalogo }
                : { nome: '', descricao: '' } 
        );
        setIsModalOpen(true);
    };

    const handleFecharModal = () => {
        setIsModalOpen(false);
        setCatalogoEmEdicao(null);
    };

    const handleModalInputChange = (e) => {
        const { name, value } = e.target;
        setCatalogoEmEdicao(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        const isEdit = !!catalogoEmEdicao.id;
        const url = isEdit ? `/api/catalogos/${catalogoEmEdicao.id}` : '/catalogos';
        const method = isEdit ? 'PUT' : 'POST';

        // MUDANÇA: Envia apenas os dados relevantes (sem caminhoPasta)
        const { nome, descricao } = catalogoEmEdicao;

        try {
            const response = await apiFetch(url, {
                method: method,
                body: JSON.stringify({ nome, descricao }),
            });
            if (!response.ok) throw new Error('Falha ao salvar o catálogo.');
            
            const catalogoSalvo = await response.json();
            
            if (isEdit) {
                setCatalogos(prev => prev.map(c => c.id === catalogoSalvo.id ? catalogoSalvo : c));
            } else {
                setCatalogos(prev => [...prev, catalogoSalvo]);
            }
            handleFecharModal();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="gerenciar-container"><h1>Gestão de Catálogos</h1><p>A carregar...</p></div>;
    if (error) return <div className="gerenciar-container"><h1>Gestão de Catálogos</h1><p>Erro: {error}</p></div>;

    return (
        <div className="gerenciar-container">
            <div className="header-container">
                <h1>Gestão de Catálogos</h1>
                <button className="botao-novo" onClick={() => handleAbrirModal()}>
                    <BsPlusCircleFill /> Novo Catálogo
                </button>
            </div>
            <table className="gerenciar-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {catalogos.map(cat => (
                        <tr key={cat.id}>
                            <td>{cat.nome}</td>
                            <td>{cat.descricao}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => handleAbrirModal(cat)} title="Editar"><BsPencilSquare /></button>
                                <button className="action-btn delete-btn" onClick={() => handleDeletar(cat.id, cat.nome)} title="Apagar"><BsTrashFill /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleFecharModal}>
                    <form className="modal-content" onSubmit={handleSalvar} onClick={e => e.stopPropagation()}>
                        <h2>{catalogoEmEdicao.id ? 'Editar Catálogo' : 'Novo Catálogo'}</h2>
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input id="nome" name="nome" type="text" value={catalogoEmEdicao.nome} onChange={handleModalInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea id="descricao" name="descricao" value={catalogoEmEdicao.descricao} onChange={handleModalInputChange}></textarea>
                        </div>

                        <div className="modal-actions">
                            <button type="submit">Salvar</button>
                            <button type="button" onClick={handleFecharModal}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GerenciarCatalogos;
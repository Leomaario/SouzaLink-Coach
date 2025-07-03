import React, { useState, useEffect } from 'react';
import { apiFetch } from '../Services/api';
import { BsPencilSquare, BsTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import '../Styles/Css-Admin/GerenciarCatalogo.css'; // Usaremos um CSS dedicado

const GerenciarCatalogos = () => {
    const [catalogos, setCatalogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para o modal de criação/edição
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catalogoEmEdicao, setCatalogoEmEdicao] = useState(null); // null para criar, objeto para editar

    useEffect(() => {
        const fetchCatalogos = async () => {
            try {
                const response = await apiFetch('/api/catalogos');
                if (!response.ok) throw new Error('Falha ao carregar catálogos.');
                const data = await response.json();
                setCatalogos(data);
            } catch (err) {
                setError(err.message);
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
        // Se nenhum catálogo for passado, é para criar um novo
        setCatalogoEmEdicao(catalogo ? { ...catalogo } : { nome: '', descricao: '', icone: '', tag: '' });
        setIsModalOpen(true);
    };

    const handleFecharModal = () => {
        setIsModalOpen(false);
        setCatalogoEmEdicao(null);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        const isEdit = !!catalogoEmEdicao.id;
        const url = isEdit ? `/api/catalogos/${catalogoEmEdicao.id}` : '/api/catalogos';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await apiFetch(url, {
                method: method,
                body: JSON.stringify(catalogoEmEdicao),
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
                        <th>Tag</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {catalogos.map(cat => (
                        <tr key={cat.id}>
                            <td>{cat.nome}</td>
                            <td>{cat.descricao}</td>
                            <td><span className="tag">{cat.tag}</span></td>
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
                        {/* ... inputs para nome, descrição, ícone e tag ... */}
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
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../Services/api';
import { BsPencilSquare, BsTrashFill } from 'react-icons/bs';
import '../Styles/Css-Admin/GerenciarUsuarios.css';

const GerenciarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, groupsResponse] = await Promise.all([
                    apiFetch('/api/usuarios'),
                    apiFetch('/api/grupos')
                ]);
                if (!usersResponse.ok || !groupsResponse.ok) {
                    throw new Error('Falha ao carregar dados da página.');
                }
                const usersData = await usersResponse.json();
                const groupsData = await groupsResponse.json();
                setUsuarios(usersData);
                setGrupos(groupsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeletar = async (id, nome) => {
        if (window.confirm(`Tem a certeza que quer apagar o utilizador "${nome}"?`)) {
            try {
                const response = await apiFetch(`/api/usuarios/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Falha ao apagar.');
                setUsuarios(prev => prev.filter(u => u.id !== id));
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleAbrirModal = (usuario) => {
        setUsuarioEmEdicao({ ...usuario });
        setIsModalOpen(true);
    };

    const handleFecharModal = () => {
        setIsModalOpen(false);
        setUsuarioEmEdicao(null);
    };

    const handleSalvarEdicao = async (e) => {
        e.preventDefault();
        try {
            const { id, nome, email, grupo, permissoes } = usuarioEmEdicao;
            const response = await apiFetch(`/api/usuarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ nome, email, grupo, permissoes }),
            });
            if (!response.ok) throw new Error('Falha ao atualizar.');
            const usuarioAtualizado = await response.json();
            setUsuarios(prev => prev.map(u => u.id === usuarioAtualizado.id ? usuarioAtualizado : u));
            handleFecharModal();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleModalInputChange = (e) => {
        const { name, value } = e.target;
        setUsuarioEmEdicao(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="gerenciar-usuarios-container"><h1>Gestão de Utilizadores</h1><p>A carregar...</p></div>;
    if (error) return <div className="gerenciar-usuarios-container"><h1>Gestão de Utilizadores</h1><p>Erro: {error}</p></div>;

    return (
        <div className="gerenciar-usuarios-container">
            <h1>Gestão de Utilizadores</h1>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Grupo</th>
                        <th>Permissão</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(user => (
                        <tr key={user.id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.grupo}</td>
                            <td>{user.permissoes}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => handleAbrirModal(user)} title="Editar">
                                    <BsPencilSquare />
                                </button>
                                <button className="action-btn delete-btn" onClick={() => handleDeletar(user.id, user.nome)} title="Apagar">
                                    <BsTrashFill />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleFecharModal}>
                    <form className="modal-content" onSubmit={handleSalvarEdicao} onClick={e => e.stopPropagation()}>
                        <h2>Editar Utilizador</h2>
                        <div className="form-group">
                            <label>Nome</label>
                            <input name="nome" type="text" value={usuarioEmEdicao.nome} onChange={handleModalInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" value={usuarioEmEdicao.email} onChange={handleModalInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Grupo</label>
                            <select name="grupo" value={usuarioEmEdicao.grupo} onChange={handleModalInputChange}>
                                {grupos.map(g => <option key={g.id} value={g.nome}>{g.nome}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Permissão</label>
                            <select name="permissoes" value={usuarioEmEdicao.permissoes} onChange={handleModalInputChange}>
                                <option value="USER">Usuário</option>
                                <option value="LIDER">Líder</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button type="submit">Salvar Alterações</button>
                            <button type="button" onClick={handleFecharModal}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GerenciarUsuarios;
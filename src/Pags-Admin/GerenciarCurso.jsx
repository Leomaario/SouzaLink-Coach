import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../Services/api';
import { BsPencilSquare, BsTrashFill } from 'react-icons/bs';
import '../Styles/Css-Admin/GerenciarCursos.css'; 

const GerenciarCursos = () => {
    const [videos, setVideos] = useState([]);
    const [catalogos, setCatalogos] = useState([]); // Para o dropdown de edição
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoEmEdicao, setVideoEmEdicao] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [videosResponse, catalogosResponse] = await Promise.all([
                    apiFetch('http://localhost:8080/api/videos'),
                    apiFetch('http://localhost:8080/api/catalogos')
                ]);
                if (!videosResponse.ok || !catalogosResponse.ok) throw new Error('Falha ao carregar dados.');
                
                setVideos(await videosResponse.json());
                setCatalogos(await catalogosResponse.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeletar = async (id, nome) => {
        if (window.confirm(`Tem a certeza que quer apagar o curso "${nome}"?`)) {
            try {
                await apiFetch(`/api/videos/${id}`, { method: 'DELETE' });
                setVideos(prev => prev.filter(v => v.id !== id));
            } catch (err) {
                alert('Falha ao apagar o curso.');
            }
        }
    };

    const handleAbrirModal = (video) => {
        setVideoEmEdicao({ ...video });
        setIsModalOpen(true);
    };

    const handleFecharModal = () => setIsModalOpen(false);

    const handleSalvarEdicao = async (e) => {
        e.preventDefault();
        try {
            const { id, titulo, descricao, catalogoId } = videoEmEdicao;
            const response = await apiFetch(`/api/videos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ titulo, descricao, catalogoId }),
            });

            if (!response.ok) throw new Error('Falha ao atualizar.');
            
            const videoAtualizado = await response.json();
            setVideos(prev => prev.map(v => v.id === videoAtualizado.id ? videoAtualizado : v));
            handleFecharModal();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleModalInputChange = (e) => {
        const { name, value } = e.target;
        setVideoEmEdicao(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="gerenciar-container"><h1>Gestão de Cursos</h1><p>A carregar...</p></div>;
    if (error) return <div className="gerenciar-container"><h1>Gestão de Cursos</h1><p>Erro: {error}</p></div>;

    return (
        <div className="gerenciar-container">
            <h1>Gestão de Cursos</h1>
            <table className="gerenciar-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Catálogo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map(video => (
                        <tr key={video.id}>
                            <td>{video.titulo}</td>
                            <td>{video.catalogoNome}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => handleAbrirModal(video)} title="Editar"><BsPencilSquare /></button>
                                <button className="action-btn delete-btn" onClick={() => handleDeletar(video.id, video.titulo)} title="Apagar"><BsTrashFill /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <form className="modal-content" onSubmit={handleSalvarEdicao}>
                        <h2>Editar Curso</h2>
                        <div className="form-group">
                            <label>Título</label>
                            <input name="titulo" type="text" value={videoEmEdicao.titulo} onChange={handleModalInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea name="descricao" value={videoEmEdicao.descricao} onChange={handleModalInputChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Catálogo</label>
                            <select name="catalogoId" value={videoEmEdicao.catalogoId} onChange={handleModalInputChange} required>
                                {catalogos.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
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

export default GerenciarCursos;
import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CursosAdmin.css';
import { apiFetch } from '../Services/api';

export default function CursosAdmin() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [catalogoId, setCatalogoId] = useState('');
    const [urlDoVideo, setUrlDoVideo] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchCatalogos = async () => {
            try {
                // ...dentro do useEffect
                const videoResponse = await apiFetch(`/videos/buscar/${id}`);
                if (response.ok && response.status !== 204) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setCategorias(data);
                    }
                }
            } catch (error) {
                if (error.message !== 'Não autorizado') {
                    setMensagem({ type: 'error', text: 'Erro ao carregar categorias.' });
                }
            }
        };
        fetchCatalogos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titulo || !catalogoId || !urlDoVideo) {
            setMensagem({ type: 'error', text: 'Título, Categoria e URL do Vídeo são obrigatórios!' });
            return;
        }

        setLoading(true);
        setMensagem({ type: 'info', text: 'Enviando...' });

        const novoCursoData = {
            titulo,
            descricao,
            catalogoId: Number(catalogoId),
            urlDoVideo,
        };

        try {
            const response = await apiFetch('/videos', {
                method: 'POST',
                body: JSON.stringify(novoCursoData),
            });
            
            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.message || 'Falha ao cadastrar o curso.');
            }

            setMensagem({ type: 'success', text: `Curso "${resultado.titulo}" cadastrado!` });
            setTitulo('');
            setDescricao('');
            setCatalogoId('');
            setUrlDoVideo('');
        } catch (error) {
            setMensagem({ type: 'error', text: `Erro: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="adicionar-curso-container">
            <h2>Adicionar Novo Curso</h2>
            <form className="form-curso" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título do Curso</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Categoria</label>
                    <select value={catalogoId} onChange={(e) => setCatalogoId(e.target.value)} required>
                        <option value="" disabled>Selecione a categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>URL do Vídeo</label>
                    <input
                        type="url"
                        value={urlDoVideo}
                        onChange={(e) => setUrlDoVideo(e.target.value)}
                        placeholder="URL do vídeo (ex: https://www.youtube.com/watch?v=...)"
                        required
                    />
                </div>
                <button type="submit" className="btn-enviar" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Curso'}
                </button>
                {mensagem.text && !loading && (
                    <p className={mensagem.type === 'success' ? 'feedback-success' : 'feedback-error'}>
                        {mensagem.text}
                    </p>
                )}
            </form>
        </div>
    );
}
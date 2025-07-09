import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CursosAdmin.css';
import { apiFetch } from '../Services/api';

export default function CursosAdmin() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [catalogoId, setCatalogoId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const response = await apiFetch('http://localhost:8080/api/catalogos');
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

  const handleVideoUpload = (e) => {
    setVideoFile(e.target.files[0]);
    setUploadProgress(0);
    setMensagem({ type: '', text: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !catalogoId || !videoFile) {
      setMensagem({ type: 'error', text: 'Todos os campos são obrigatórios!' });
      return;
    }

    setLoading(true);
    setMensagem({ type: 'info', text: 'Enviando...' });

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('catalogoId', catalogoId);
    formData.append('file', videoFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/api/videos', true);

    const token = localStorage.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    } else {
      setMensagem({ type: 'error', text: 'Erro de autenticação. Por favor, faça login novamente.' });
      setLoading(false);
      return;
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setLoading(false);
      if (xhr.status === 201 || xhr.status === 200) {
        const resultado = JSON.parse(xhr.responseText);
        setMensagem({ type: 'success', text: `Curso "${resultado.titulo}" cadastrado!` });
        e.target.reset();
        setTitulo('');
        setDescricao('');
        setCatalogoId('');
        setVideoFile(null);
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        setMensagem({ type: 'error', text: `Erro: ${xhr.responseText || xhr.statusText}` });
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setMensagem({ type: 'error', text: 'Erro de rede ou CORS.' });
      setUploadProgress(0);
    };

    xhr.send(formData);
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
          <label>Upload do Vídeo</label>
          <input type="file" accept="video/*" onChange={handleVideoUpload} required />
        </div>
        {loading && (
          <div className="upload-progress-container" style={{ margin: '15px 0' }}>
            <p>Enviando: {uploadProgress}%</p>
            <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
              <div
                style={{
                  width: `${uploadProgress}%`,
                  backgroundColor: '#0d6efd',
                  height: '24px',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease-in-out',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                {uploadProgress > 5 && `${uploadProgress}%`}
              </div>
            </div>
          </div>
        )}
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
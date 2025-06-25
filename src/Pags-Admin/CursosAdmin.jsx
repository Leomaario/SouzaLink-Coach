import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CursosAdmin.css';


export default function CursosAdmin() {
  // --- ESTADOS PARA OS CAMPOS DO FORMULÁRIO ---
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [catalogoId, setCatalogoId] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  // --- ESTADO PARA GUARDAR AS CATEGORIAS VINDAS DO BACKEND ---
  const [categorias, setCategorias] = useState([]);

  // --- ESTADOS PARA DAR FEEDBACK AO USUÁRIO ---
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });

  // --- LÓGICA PARA BUSCAR AS CATEGORIAS REAIS DO BACKEND ---
  useEffect(() => {
    // Busca as categorias disponíveis assim que o componente carrega
    fetch('http://localhost:8080/api/catalogos')
      .then(response => {
        if (response.ok && response.status !== 204) {
          return response.json();
        }
        return [];
      })
      .then(data => setCategorias(data))
      .catch(() => {
        setMensagem({ type: 'error', text: 'Não foi possível carregar as categorias do servidor.' });
      });
  }, []); // O array vazio [] garante que isso rode só uma vez

  // Função para guardar o arquivo de vídeo selecionado
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Por favor, selecione um arquivo de vídeo válido.');
      e.target.value = null; // Limpa o input se o arquivo for inválido
    }
  };

  // --- LÓGICA PARA ENVIAR O FORMULÁRIO COMPLETO PARA A API ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação para garantir que tudo foi preenchido
    if (!titulo || !catalogoId || !videoFile) {
      setMensagem({ type: 'error', text: 'Todos os campos são obrigatórios!' });
      return;
    }

    setLoading(true);
    setMensagem({ type: '', text: '' });

    // FormData é o jeito certo de enviar arquivos + dados de texto
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('catalogoId', catalogoId);
    formData.append('file', videoFile); // O nome 'file' tem que bater com o @RequestParam no backend

    try {
      const response = await fetch('http://localhost:8080/api/videos', {
        method: 'POST',
        body: formData, // Para FormData, o navegador define o Content-Type automaticamente
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao cadastrar o curso.');
      }

      const resultado = await response.json();
      setMensagem({ type: 'success', text: `Curso "${resultado.titulo}" cadastrado com sucesso!` });

      // Limpa o formulário
      setTitulo('');
      setDescricao('');
      setCatalogoId('');
      setVideoFile(null);
      e.target.reset();

    } catch (error) {
      setMensagem({ type: 'error', text: error.message || 'Ocorreu um erro inesperado.' });
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
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: React Avançado"
            required
          />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Insira uma descrição clara e objetiva"
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <select
            name="categoria"
            value={catalogoId}
            onChange={(e) => setCatalogoId(e.target.value)}
            required
          >
            <option value="" disabled>Selecione a categoria</option>
            {/* O select agora é preenchido com as categorias reais do banco */}
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Upload do Vídeo</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            required
          />
        </div>
        <button type="submit" className="btn-enviar" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Curso'}
        </button>
        {mensagem.text && (
          <p className={`mensagem-feedback ${mensagem.type}`}>
            {mensagem.text}
          </p>
        )}
      </form>
    </div>
  );
}

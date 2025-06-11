import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CursosAdmin.css';

export default function CursosAdmin() {
  const [curso, setCurso] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    video: null
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Simula o fetch das categorias existentes do backend
    setCategorias(['Frontend', 'Backend', 'DevOps', 'Mobile']);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurso({ ...curso, [name]: value });
  };

  const handleVideoUpload = (e) => {
      const file = e.target.files[0];
    
      if (file && file.type.startsWith('video/')) {
        setCurso({ ...curso, video: file });
      } else {
        alert('Por favor, selecione um arquivo de vídeo válido.');
        e.target.value = ''; // limpa o input
      }
    };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', curso.titulo);
    formData.append('descricao', curso.descricao);
    formData.append('categoria', curso.categoria);
    formData.append('video', curso.video);

    console.log('Enviando curso:', curso);
    // Aqui você usaria axios/fetch para enviar `formData` ao backend
  };

  return (
    <div className="adicionar-curso-container">
      <h2>Adicionar Novo Curso</h2>
      <form className="form-curso" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Título do Curso</label>
          <input
            type="text"
            name="titulo"
            value={curso.titulo}
            onChange={handleChange}
            placeholder="Ex: React Avançado"
            required
          />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={curso.descricao}
            onChange={handleChange}
            placeholder="Insira uma descrição clara e objetiva"
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <select
            name="categoria"
            value={curso.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a categoria</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
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
        <button type="submit" className="btn-enviar" onClick={() => alert("curso adicionado")} >Cadastrar Curso</button>
      </form>
    </div>
  );
}

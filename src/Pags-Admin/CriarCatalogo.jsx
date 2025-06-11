import React, { useState } from 'react';
import '../../src/Styles/Css-Admin/CriarCatalogo.css';

export default function CriarCatalogo() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cursosSelecionados, setCursosSelecionados] = useState([]);

  const cursosDisponiveis = ['React Básico', 'Java Avançado', 'Kotlin Iniciante', 'HTML + CSS'];

  const handleCheckbox = (curso) => {
    if (cursosSelecionados.includes(curso)) {
      setCursosSelecionados(cursosSelecionados.filter(c => c !== curso));
    } else {
      setCursosSelecionados([...cursosSelecionados, curso]);
    }
  };

  const handleCriarCatalogo = () => {
    const novoCatalogo = {
      nome,
      descricao,
      cursos: cursosSelecionados
    };
    console.log("Catálogo criado:", novoCatalogo);
    // Aqui você pode enviar para a API ou salvar no backend
    alert('Catálogo criado com sucesso!');
  };

  return (
    <div className="criar-catalogo-container">
      <h2>Criar Novo Catálogo</h2>

      <div className="form-group">
        <label>Nome do Catálogo</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Front-end Intermediário"
        />
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva o que este catálogo aborda..."
        />
      </div>

      <div className="form-group">
        <label>Cursos disponíveis</label>
        <div className="cursos-lista">
          {cursosDisponiveis.map((curso, index) => (
            <label key={index} className="checkbox-item">
              <input
                type="checkbox"
                checked={cursosSelecionados.includes(curso)}
                onChange={() => handleCheckbox(curso)}
              />
              {curso}
            </label>
          ))}
        </div>
      </div>

      <button className="botao-criar" onClick={handleCriarCatalogo}>
        Criar Catálogo
      </button>
    </div>
  );
}

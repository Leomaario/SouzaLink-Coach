import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CriarUser.css'; 
import { apiFetch } from '.././Services/api'; // <<< IMPORTA O NOSSO PADRÃO

export default function CriarUsuario() {
  // Os seus estados continuam os mesmos
  const [formState, setFormState] = useState({
    nome: '',
    usuario: '',
    email: '',
    senha: '',
    grupo: '',
    permissoes: 'USER' // Definindo um valor padrão
  });
  const [grupos, setGrupos] = useState(['ti', 'farmacia', 'nutricao', 'enfermagem']);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ type: '', text: '' });

    const dadosParaEnviar = { ...formState };

    try {
      // --- LÓGICA ATUALIZADA: USANDO apiFetch ---
      const response = await apiFetch('http://localhost:8080/api/auth/registrar', {
        method: 'POST',
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao registrar o usuário.');
      }

      setMensagem({ type: 'success', text: data.message });
      setFormState({ nome: '', usuario: '', email: '', senha: '', grupo: '', permissoes: 'USER' });

    } catch (error) {
      if (error.message !== 'Não autorizado') {
        setMensagem({ type: 'error', text: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-usuario-container">
      <h2>Criar Novo Usuário</h2>
      <form className="form-usuario" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Nome Completo</label>
          <input type="text" name="nome" value={formState.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Nome de Usuário (para login)</label>
          <input type="text" name="usuario" value={formState.usuario} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formState.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input type="password" name="senha" value={formState.senha} onChange={handleChange} required />
        </div>

        <div className="form-group grupo-com-botao">
          <label>Grupo</label>
          <div className="grupo-wrapper">
            <select name="grupo" value={formState.grupo} onChange={handleChange} required>
              <option value="">Selecione um grupo</option>
              {grupos.map((g, index) => (
                <option key={index} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
            <button type="button" onClick={abrirModalGrupo} className="btn-mais-grupo">+</button>
          </div>
        </div>

        <div className="form-group">
          <label>Permissão</label>
          <select name="permissoes" value={formState.permissoes} onChange={handleChange} required>
            <option value="USER">Usuário</option>
            <option value="LIDER">Líder</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn-cadastrar" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
        </button>

        {mensagem.text && (
          <p className={mensagem.type === 'success' ? 'feedback-success' : 'feedback-error'}>
            {mensagem.text}
          </p>
        )}
      </form>

  
    </div>
  );
}


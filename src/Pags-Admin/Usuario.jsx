import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CriarUser.css'; 

export default function CriarUsuario() {
  
  // --- ESTADO PARA OS DADOS DO FORMULÁRIO ---
  // Adicionei um campo 'usuario' para bater com o nosso backend
  const [formState, setFormState] = useState({
    nome: '',
    usuario: '', // Campo de nome de usuário para login
    email: '',
    senha: '',
    grupo: '',
    permissoes: '' // O valor padrão pode ser USER, ADMIN, etc.
  });

  // --- ESTADOS PARA A LÓGICA DO COMPONENTE ---
  const [grupos, setGrupos] = useState(['ti', 'farmacia', 'nutricao', 'enfermagem']); // Mantemos alguns grupos fixos por enquanto
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });
  
  // (O modal para adicionar novos grupos continua igual, é uma ótima funcionalidade de UI)
  const [novoGrupo, setNovoGrupo] = useState(''); 
  const [mostrarModalGrupo, setMostrarModalGrupo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  // --- LÓGICA DE SUBMISSÃO PARA A API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ type: '', text: '' });

    // O objeto que vamos enviar para o backend
    const dadosParaEnviar = {
      nome: formState.nome,
      usuario: formState.usuario,
      email: formState.email,
      senha: formState.senha,
      grupo: formState.grupo,
      permissoes: formState.permissoes || '', // Garante um valor padrão
    };

    try {
      // Usando o endpoint de registro que criamos
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!response.ok) {
        // Se o backend retornar um erro (ex: email já existe), a gente pega a mensagem
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao registrar o usuário.');
      }

      setMensagem({ type: 'success', text: 'Usuário cadastrado com sucesso!' });
      // Limpa o formulário
      setFormState({
        nome: '', usuario: '', email: '', senha: '', grupo: '', permissoes: ''
      });

    } catch (error) {
      setMensagem({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  // Lógica do modal (sem mudanças)
  const abrirModalGrupo = () => setMostrarModalGrupo(true);
  const fecharModalGrupo = () => setMostrarModalGrupo(false);
  const salvarGrupo = () => { /* ... sua lógica ... */ };

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


import React, { useState, useEffect } from 'react';
import '../Styles/Css-Admin/CriarUser.css';
import { apiFetch } from '../Services/api';

export default function CriarUsuario() {
  const [formState, setFormState] = useState({
    nome: '',
    usuario: '',
    email: '',
    senha: '',
    grupo: '',
    permissoes: 'USER'
  });
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });
  const [mostrarModalGrupo, setMostrarModalGrupo] = useState(false);
  const [novoGrupo, setNovoGrupo] = useState('');

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await apiFetch('/api/grupos');
        if (response.ok) {
          const data = await response.json();
          setGrupos(data);
        } else {
          throw new Error('Falha ao carregar os grupos.');
        }
      } catch (error) {
        if (error.message !== 'Não autorizado') {
          setMensagem({ type: 'error', text: error.message });
        }
      }
    };
    fetchGrupos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ type: '', text: '' });

    try {
      const response = await apiFetch('/api/auth/registrar', {
        method: 'POST',
        body: JSON.stringify(formState),
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

  const abrirModalGrupo = (e) => {
    e.preventDefault();
    setMostrarModalGrupo(true);
  };

  const fecharModalGrupo = () => setMostrarModalGrupo(false);

  const salvarGrupo = () => {
    if (novoGrupo && !grupos.find(g => g.nome.toLowerCase() === novoGrupo.toLowerCase())) {
      const grupoAdicionado = { id: Date.now(), nome: novoGrupo };
      setGrupos([...grupos, grupoAdicionado]);
    }
    setNovoGrupo('');
    fecharModalGrupo();
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
              <option value="" disabled>Selecione um grupo</option>
              {grupos.length > 0 ? (
                grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.nome}>{grupo.nome}</option>
                ))
              ) : (
                <option disabled>Carregando grupos...</option>
              )}
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
        {mensagem.text && !loading && (
          <p className={mensagem.type === 'success' ? 'feedback-success' : 'feedback-error'}>
            {mensagem.text}
          </p>
        )}
      </form>
      {mostrarModalGrupo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Adicionar Novo Grupo</h3>
            <input
              type="text"
              value={novoGrupo}
              onChange={(e) => setNovoGrupo(e.target.value)}
              placeholder="Nome do novo grupo"
            />
            <div className="modal-actions">
              <button onClick={salvarGrupo}>Salvar</button>
              <button onClick={fecharModalGrupo}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
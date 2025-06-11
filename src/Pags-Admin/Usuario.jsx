import React, { useState } from 'react';
import '../Styles/Css-Admin/CriarUser.css';

export default function CriarUsuario() {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    dataNascimento: '',
    grupo: '',
    permissao: 'usuario'
  });

  const [grupos, setGrupos] = useState([
    'farmacia',
    'scih',
    'almoxarifado',
    'nutricao',
    'enfermagem',
    'medicina',
    'fisioterapia',
    'psicologia',
    'ti'
  ]);

  const [novoGrupo, setNovoGrupo] = useState('');
  const [mostrarModalGrupo, setMostrarModalGrupo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const abrirModalGrupo = () => setMostrarModalGrupo(true);
  const fecharModalGrupo = () => {
    setNovoGrupo('');
    setMostrarModalGrupo(false);
  };

  const salvarGrupo = () => {
    const grupoFormatado = novoGrupo.trim().toLowerCase();
    if (grupoFormatado && !grupos.includes(grupoFormatado)) {
      setGrupos([...grupos, grupoFormatado]);
      setUsuario({ ...usuario, grupo: grupoFormatado }); // opcional: já seleciona o grupo criado
      fecharModalGrupo();
    } else {
      alert('Grupo já existe ou inválido!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Usuário criado:', usuario);
    alert('Usuário cadastrado com sucesso!');
    // Aqui você pode integrar com backend
  };

  return (
    <div className="criar-usuario-container">
      <h2>Criar Novo Usuário</h2>
      <form className="form-usuario" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input type="text" name="nome" value={usuario.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={usuario.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input type="password" name="senha" value={usuario.senha} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Data de Nascimento</label>
          <input type="date" name="dataNascimento" value={usuario.dataNascimento} onChange={handleChange} required />
        </div>

        <div className="form-group grupo-com-botao">
          <label>Grupo</label>
          <div className="grupo-wrapper">
            <select name="grupo" value={usuario.grupo} onChange={handleChange} required>
              <option value="">Selecione</option>
              {grupos.map((grupo, index) => (
                <option key={index} value={grupo}>{grupo.charAt(0).toUpperCase() + grupo.slice(1)}</option>
              ))}
            </select>
            <button type="button" title="Adicionar grupo" onClick={abrirModalGrupo} className="btn-mais-grupo">+</button>
          </div>
        </div>

        <div className="form-group">
          <label>Permissão</label>
          <select name="permissao" value={usuario.permissao} onChange={handleChange} required>
            <option value="usuario">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn-cadastrar">Cadastrar Usuário</button>
      </form>

      {/* Modal para adicionar grupo */}
      {mostrarModalGrupo && (
        <div className="modal-fundo" onClick={fecharModalGrupo}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar Novo Grupo</h3>
            <input
              type="text"
              value={novoGrupo}
              onChange={(e) => setNovoGrupo(e.target.value)}
              placeholder="Nome do grupo"
            />
            <div className="modal-botoes">
              <button className="btn-salvar" onClick={salvarGrupo}>Salvar</button>
              <button className="btn-cancelar" onClick={fecharModalGrupo}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

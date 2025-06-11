
import React, { useState } from 'react';
import '@styles/EditProfile.css';


const EditProfile = () => {
  const [foto, setFoto] = useState('https://placehold.co/120x120.png?text=Foto');

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="edit-profile-container">
      <h1>Editar Perfil</h1>

      <div className="profile-card">
        <div className="left-section">
          <label htmlFor="foto-upload" className="foto-preview">
            <img src={foto} alt="Foto de Perfil" />
            <span className="alterar-foto">Alterar Foto</span>
          </label>
          <input
            id="foto-upload"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            hidden
          />
        </div>

        <div className="right-section">
          <div className="form-group">
            <label>Nome completo</label>
            <input type="text" placeholder="Seu nome" />
          </div>

          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Função</label>
            <input type="text" placeholder="Ex: Analista de TI" />
          </div>

          <div className="form-group">
            <label>Nova Senha</label>
            <input type="password" placeholder="Digite nova senha" />
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input type="password" placeholder="Confirme a nova senha" />
          </div>

          <div className="btn-area">
            <button className="btn-salvar">Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

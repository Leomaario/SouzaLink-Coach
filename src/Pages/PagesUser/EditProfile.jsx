import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import '@styles/EditProfile.css';

const EditProfile = () => {
    // Estado para guardar os dados do perfil
    const [profileData, setProfileData] = useState({
        nome: '',
        usuario: '', // O nome de login
        email: '',
        // Adicione outros campos que você tenha, como dataNascimento, funcao, etc.
    });
    const [foto, setFoto] = useState('https://placehold.co/120x120/03a5b7/FFFFFF?text=Foto');
    const [loading, setLoading] = useState(true);

    // Busca os dados do perfil quando a página carrega
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetch('/api/profile/me');
                if (!response.ok) throw new Error('Falha ao carregar perfil.');
                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                console.error("Erro:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(URL.createObjectURL(file));
            // Aqui você adicionaria a lógica para fazer o upload da foto para o backend
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica para salvar as alterações no backend
        try {
            const response = await apiFetch('/api/profile/me', {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });
            if (!response.ok) throw new Error('Falha ao atualizar.');
            alert('Perfil atualizado com sucesso!');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <div className="edit-profile-container"><h1>Editar Perfil</h1><p>A carregar...</p></div>;
    }

    return (
        <div className="edit-profile-container">
            <h1>Editar Perfil</h1>

            <form className="profile-card" onSubmit={handleSubmit}>
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
                        <label>Nome de Utilizador (não pode ser alterado)</label>
                        <input type="text" value={profileData.usuario} readOnly disabled />
                    </div>

                    <div className="form-group">
                        <label>Nome completo</label>
                        <input name="nome" type="text" value={profileData.nome} onChange={handleInputChange} placeholder="Seu nome completo" />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={profileData.email} onChange={handleInputChange} placeholder="Seu email" />
                    </div>

                    {/* Adicione outros campos aqui, como Data de Nascimento, Função, etc. */}
                    
                    <div className="form-group">
                        <label>Nova Senha (deixe em branco para não alterar)</label>
                        <input name="senha" type="password" onChange={handleInputChange} placeholder="Digite uma nova senha" />
                    </div>

                    <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <input name="confirmarSenha" type="password" onChange={handleInputChange} placeholder="Confirme a nova senha" />
                    </div>

                    <div className="btn-area">
                        <button type="submit" className="btn-salvar">Salvar Alterações</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
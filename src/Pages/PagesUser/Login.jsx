import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Login.css';
import { apiFetch } from '../../Services/api';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usuario, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Credenciais inválidas. Tente novamente.');
        }

        if (data.token) {
            localStorage.setItem('token', data.token);
            const userData = {
                id: data.id,
                usuario: data.usuario,
                email: data.email,
                roles: data.roles
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUsuario('');
            setSenha('');
            navigate('/dashboard');
        } else {
            throw new Error('Token não recebido do servidor.');
        }
    } catch (err) {
        setError(`Erro no Backend: ${err.message}. Contate o Administrador.`);
        console.error('Login error:', err);
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="login-container">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <img src="/imgs/logo.png" alt="Logo" className="logo" />
                <input
                    type="text"
                    placeholder="Usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                
            </form>
        </div>
    );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Login.css'; // Certifique-se de que o caminho está correto
import { apiFetch } from '../../services/api'; // Certifique-se que o caminho para api.js está correto

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
            const response = await apiFetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ usuario, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Credenciais inválidas. Tente novamente.');
            }

            if (data.token) {
                // Guarda o token na sua própria chave
                localStorage.setItem('token', data.token);

                // --- AQUI ESTÁ A CORREÇÃO ---
                // Cria o objeto do utilizador, garantindo que as 'roles' estão incluídas
                const userData = {
                    id: data.id,
                    usuario: data.usuario,
                    email: data.email,
                    roles: data.roles // <<< A LINHA QUE FALTAVA
                };
                // Guarda o objeto completo do utilizador
                localStorage.setItem('user', JSON.stringify(userData));

                // Navega para o dashboard após o sucesso
                navigate('/dashboard');
            } else {
                throw new Error('Token não recebido do servidor.');
            }

        } catch (err) {
            setError(err.message);
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
}

export default Login;
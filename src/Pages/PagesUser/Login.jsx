import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Login.css'; // Certifique-se de que o caminho está correto

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
        console.log('--- [FRONTEND] Iniciando tentativa de login...');

        try {
            const payload = { usuario, senha };
            console.log('--- [FRONTEND] Enviando para o backend:', payload);

            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('--- [FRONTEND] Resposta recebida do backend. Status:', response.status);
            const data = await response.json();

            if (!response.ok) {
                console.error('--- [FRONTEND] Resposta de erro do backend:', data);
                throw new Error(data.message || 'Credenciais inválidas. Tente novamente.');
            }

            console.log('--- [FRONTEND] Login bem-sucedido! Dados recebidos:', data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                const userData = {
                    id: data.id,
                    usuario: data.usuario,
                    email: data.email
                };
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('--- [FRONTEND] Token e usuário salvos. Navegando para /');
                navigate('/dashboard'); // Redireciona para o dashboard após login bem-sucedido
            } else {
                throw new Error('Token não recebido do servidor.');
            }

        } catch (err) {
            console.error('--- [FRONTEND] ERRO CAPTURADO NO BLOCO CATCH:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log('--- [FRONTEND] Finalizando tentativa de login.');
        }
    };

    return (
        <div className="login-container">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
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
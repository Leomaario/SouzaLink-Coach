import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Login.css'; // Certifique-se de que o caminho está correto

const Login = () => {
    // --- MUDANÇA 1: O estado agora é 'usuario', não 'email' ---
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Adicionado para feedback visual
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // --- MUDANÇA 2: O endpoint correto é /api/auth/login ---
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // --- MUDANÇA 3: Enviamos 'usuario', não 'email' ---
                body: JSON.stringify({ usuario, senha }),
            });

            const data = await response.json(); // Pega a resposta completa do backend

            if (!response.ok) {
                // Usa a mensagem de erro do backend, se houver, ou uma padrão
                throw new Error(data.message || 'Credenciais inválidas. Tente novamente.');
            }

            // --- MUDANÇA 4 (CRÍTICA): Salvar o token e os dados do usuário! ---
            if (data.token) {
                // Salva o token no localStorage do navegador
                localStorage.setItem('token', data.token);

                // Salva os dados do usuário (exceto o token) para uso na UI
                const userData = {
                    id: data.id,
                    username: data.username,
                    email: data.email
                };
                localStorage.setItem('user', JSON.stringify(userData));

                // Agora sim, redireciona para a página principal
                navigate('/');
            } else {
                 throw new Error('Token não recebido do servidor.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Para o indicador de loading
        }
    };

    return (
        <div className="login-container">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                {/* --- MUDANÇA 5: O input agora é para 'usuário' --- */}
                <input
                    type="text" // Tipo 'text' é mais apropriado para nome de usuário
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
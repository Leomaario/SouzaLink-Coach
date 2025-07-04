import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../Services/api';
import '@styles/Certificados.css';
// --- IMPORTANDO OS ÍCONES ---
import { EyeFill, CloudDownloadFill, ShareFill } from 'react-bootstrap-icons';

const Certificados = () => {
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeusCertificados = async () => {
            try {
                const response = await apiFetch('/api/certificados/meus');
                if (!response.ok) {
                    throw new Error('Falha ao carregar seus certificados.');
                }
                const data = await response.json();
                setCertificados(data);
            } catch (err) {
                if (err.message !== 'Não autorizado') setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMeusCertificados();
    }, []);

    if (loading) return <div className="certificados-container"><h1>Seus Certificados</h1><p>A carregar...</p></div>;
    if (error) return <div className="certificados-container"><h1>Seus Certificados</h1><p>Erro: {error}</p></div>;

    return (
        <div className="certificados-container">
            <div className="certificado-topo">
                <img
                    src="https://placehold.co/800x300/03339c/FFFFFF?text=Modelo+de+Certificado"
                    alt="Modelo de Certificado"
                    className="modelo-certificado"
                />
                <button className="botao-visualizar">Visualizar Modelo</button>
            </div>

            <h1 className="titulo-certificados">Seus Certificados</h1>
            <p className="subtitulo-certificados">Veja os cursos que você concluiu com sucesso e emita seus comprovantes.</p>

            <div className="filtros">
                <input type="text" placeholder="Buscar por nome do curso..." />
                <select>
                    <option>Todos os anos</option>
                    <option>2025</option>
                </select>
            </div>

            <div className="lista-certificados">
                {certificados.length > 0 ? (
                    certificados.map((cert) => (
                        <div key={cert.id} className="card-certificado">
                            <img src={`https://placehold.co/300x200/4472C4/FFFFFF?text=${encodeURIComponent(cert.tituloCurso)}`} alt={cert.tituloCurso} />
                            <div className="card-info">
                                <h3>{cert.tituloCurso}</h3>
                                <p>Concluído em: {new Date(cert.dataEmissao).toLocaleDateString('pt-BR')}</p>
                                <div className="acoes">
                                    <button><EyeFill /> Visualizar</button>
                                    <button className="primary-action"><CloudDownloadFill /> Baixar PDF</button>
                                    <button><ShareFill /> Compartilhar</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='status-message'>Você ainda não possui certificados para exibir.</p>
                )}
            </div>
        </div>
    );
};

export default Certificados;
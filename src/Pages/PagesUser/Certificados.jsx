import React from 'react';
import '@styles/Certificados.css';

const certificados = [
  {
    id: 1,
    curso: "React Avançado",
    data: "Janeiro/2025",
    imagem: "https://placehold.co/300x200/4472C4/FFFFFF?text=React",
  },
  {
    id: 2,
    curso: "JavaScript Moderno",
    data: "Dezembro/2024",
    imagem: "https://placehold.co/300x200/F6820D/FFFFFF?text=JS",
  },
  {
    id: 3,
    curso: "GLPI Chamados",
    data: "Março/2025",
    imagem: "https://placehold.co/300x200/4472C4/FFFFFF?text=GLPI",
  },
];

const Certificados = () => {
  return (
    <div className="certificados-container">
      <div className="certificado-topo">
        <img
          src="https://placehold.co/800x300/EEEEEE/333333?text=Modelo+de+Certificado"
          alt="Modelo de Certificado"
          className="modelo-certificado"
        />
        <button className="botao-visualizar">Visualizar Modelo</button>
      </div>

      <h1 className="titulo-certificados">Seus Certificados</h1>
      <p className="subtitulo-certificados">Veja os cursos que você concluiu com sucesso</p>

      <div className="filtros">
        <input type="text" placeholder="Buscar curso..." />
        <select>
          <option>Todos os anos</option>
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>

      <div className="lista-certificados">
        {certificados.map((cert) => (
          <div key={cert.id} className="card-certificado">
            <img src={cert.imagem} alt={cert.curso} />
            <h3>{cert.curso}</h3>
            <p>Concluído: {cert.data}</p>
            <div className="acoes">
              <button>Visualizar</button>
              <button>Baixar PDF</button>
              <button>Compartilhar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificados;

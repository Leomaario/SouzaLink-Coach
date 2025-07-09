import React, { useState } from 'react';
import '../Styles/Css-Admin/EmitirRelatorios.css';

export default function RelatoriosEmitir() {
  const [relatorioSelecionado, setRelatorioSelecionado] = useState('');

  const relatoriosDisponiveis = [
    'Usuários Ativos',
    'Últimos Acessos',
    'Cursos Concluídos',
    'Certificados Emitidos',
    'Tempo Médio por Curso',
  ];

  const relatoriosRecentes = [
    { titulo: 'Usuários Ativos', data: '05/05/2025' },
    { titulo: 'Últimos Acessos', data: '04/05/2025' },
    { titulo: 'Cursos Concluídos', data: '03/05/2025' },
    { titulo: 'Certificados Emitidos', data: '02/05/2025' },
  ];

  const handleSelecionar = (e) => {
    setRelatorioSelecionado(e.target.value);
  };

  const gerarRelatorio = () => {
    if (!relatorioSelecionado) {
      alert('Selecione um relatório');
      return;
    }
    alert(`Relatório "${relatorioSelecionado}" gerado!`);
  };

  return (
    <div className="emitir-relatorios-container">
      <h2>Emitir Relatórios</h2>
      <div className="relatorio-header">
        <select onChange={handleSelecionar} value={relatorioSelecionado}>
          <option value="">Selecione um relatório</option>
          {relatoriosDisponiveis.map((nome, index) => (
            <option key={index} value={nome}>{nome}</option>
          ))}
        </select>
        <button className="btn-pdf" onClick={gerarRelatorio}>Gerar PDF</button>
      </div>
      <div className="relatorios-lista">
        {relatoriosRecentes.map((rel, index) => (
          <div className="card-relatorio" key={index}>
            <h3>{rel.titulo}</h3>
            <p>Data de emissão: {rel.data}</p>
            <button className="btn-pdf">Baixar PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}

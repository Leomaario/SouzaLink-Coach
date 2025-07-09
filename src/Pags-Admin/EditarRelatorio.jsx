import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import "../Styles/Css-Admin/EditarRelatorio.css";

const EditarRelatorio = () => {
  const [elements, setElements] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef();

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const addElement = (type) => {
    if (type === "img") {
      fileInputRef.current.click();
      return;
    }
    let content = "";
    if (type === "titulo") content = "Título do Relatório";
    if (type === "paragrafo") content = "Parágrafo de exemplo.";
    if (type === "usuario") content = "Nome do Usuário";
    if (type === "ultimoacesso") content = "Último Acesso: 01/01/2025";
    if (type === "totaldecursofeito") content = "Total de Cursos Concluídos: 5";
    if (type === "empresa") content = "Empresa XPTO";
    setElements(prev => [
      ...prev,
      {
        id: Date.now(),
        type,
        content,
        x: 10,
        y: 10,
        width: 200,
        height: 50,
      },
    ]);
    setShowDropdown(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setElements(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "img",
        content: url,
        x: 10,
        y: 10,
        width: 150,
        height: 150,
      },
    ]);
  };

  const handleSave = () => {
    alert("Relatório salvo!");
  };

  return (
    <div className="page-container">
      <header className="top-header">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Campos Adicionais
        </button>
        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={() => addElement("img")}>Adicionar Imagem</button>
            <button onClick={() => addElement("titulo")}>Adicionar Título</button>
            <button onClick={() => addElement("paragrafo")}>Adicionar Parágrafo</button>
            <button onClick={() => addElement("empresa")}>Nome da Empresa</button>
            <button onClick={() => addElement("usuario")}>Nome do Usuário</button>
            <button onClick={() => addElement("ultimoacesso")}>Último Acesso</button>
            <button onClick={() => addElement("totaldecursofeito")}>Cursos Concluídos</button>
          </div>
        )}
        <button className="save-button" onClick={handleSave}>Salvar Relatório</button>
      </header>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <div className="report-page">
        {elements.map((el) => (
          <Rnd
            key={el.id}
            default={{
              x: el.x,
              y: el.y,
              width: el.width,
              height: el.height,
            }}
            bounds="parent"
          >
            {el.type === "img" ? (
              <img src={el.content} alt="uploaded" style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="report-element">{el.content}</div>
            )}
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default EditarRelatorio;

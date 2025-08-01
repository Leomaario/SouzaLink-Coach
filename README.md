# SouzaLink Coach - Frontend (React)

----
----
----
----
## 🚀 Sobre o Projeto
Interface de usuário desenvolvida para a plataforma de E-Learning **SouzaLink Coach**. Construída com React e Vite, esta Single Page Application (SPA) é responsável por toda a interação do usuário, consumindo a API RESTful do backend para exibir dados, gerenciar conteúdo e autenticar usuários.

## ✨ Funcionalidades Principais

- ✅ Interface de Login e Autenticação Segura
- 👤 Painel do Usuário e Edição de Perfil
- 📚 Catálogo de Cursos e Player de Vídeo Interativo
- 📊 Dashboard do Usuário com Progresso
- 📜 Emissão e Visualização de Certificados
- 🔐 Painéis de Gestão para Administradores (Usuários, Cursos, Catálogos)
- 📱 Design Totalmente Responsivo

## 🛠️ Tecnologias Utilizadas

- **Framework**: React 18 + Vite
- **Roteamento**: React Router DOM v6
- **Estilização**: CSS Puro com Flexbox/Grid
- **Comunicação API**: Fetch API
- **Ícones**: React Bootstrap Icons
- **Player de Vídeo**: React Player

### Dependências Principais
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-player": "^2.16.0",
    "react-router-dom": "^6.23.1",
    "react-bootstrap-icons": "^1.11.4"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
```

## 🏗️ Estrutura do Projeto
```
src/
├── assets/         # Imagens, fontes e outros recursos estáticos
├── components/     # Componentes reutilizáveis (Layout, Admin, Comuns)
├── pages/          # Componentes de página (Dashboard, Login, etc.)
├── services/       # Lógica de comunicação com a API
├── styles/         # Estilos globais e de reset
├── App.jsx         # Componente raiz e configuração de rotas
└── main.jsx        # Ponto de entrada da aplicação
```

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- Node.js v18+
- npm ou yarn
- Uma instância do backend do SouzaLink Coach a correr.

### Variáveis de Ambiente
Crie um ficheiro `.env` na raiz da pasta `/frontend` e adicione a URL da API:
```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

### Passos para Execução
1. Clone o repositório
```shell
git clone https://seu-repositorio.git
cd seu-repositorio/frontend
```

2. Instale as dependências
```shell
npm install
```

3. Execute o projeto
```shell
npm run dev
```

4. Aceda `http://localhost:5173` no seu navegador.

## 🎯 Status do Projeto
- [x] Autenticação e Roteamento de Páginas
- [x] Dashboards de Usuário e Admin
- [x] CRUD de Usuários (UI)
- [x] CRUD de Cursos e Catálogos (UI)
- [x] Player de Vídeo e Acompanhamento de Progresso
- [ ] Sistema de Notificações em Tempo Real (UI)
- [ ] Sistema de Avaliação de Cursos (UI)

## 🤝 Contribuição
1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT.

## 📞 Contato
- **LinkedIn**: [Seu LinkedIn]
- **Email**: [Seu Email]

---
⌨️ com ❤️ por [Seu Nome] 😊


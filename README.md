SouzaLink Coach - Plataforma de Capacitação Interna
Bem-vindo ao repositório do SouzaLink Coach, uma plataforma de e-learning e streaming de vídeo full-stack desenvolvida para capacitação e treinamento de equipes.

Status do Projeto: 🚧 Em Desenvolvimento Ativo 🚧

🚀 Sobre o Projeto
O SouzaLink Coach foi concebido para ser uma solução interna de treinamento, permitindo que líderes de setor criem catálogos de cursos e façam upload de vídeos de treinamento para seus subordinados. A plataforma gerencia usuários, grupos, catálogos e vídeos, com uma arquitetura robusta e escalável, construída com tecnologias modernas.

Este projeto é uma jornada de aprendizado e desenvolvimento, construindo do zero tanto o backend robusto quanto um frontend moderno e responsivo.

✨ Funcionalidades Implementadas
Gestão de Conteúdo:

CRUD completo de Catálogos: Crie, liste, atualize e delete catálogos de cursos.

Estrutura de Pastas Dinâmica: Cada catálogo é vinculado a uma pasta específica no servidor, organizando automaticamente os uploads de vídeo.

Módulo de Vídeo Avançado:

CRUD completo de Vídeos: Gerenciamento completo dos metadados dos vídeos.

Upload de Arquivos com Barra de Progresso: Uma interface intuitiva permite o upload de vídeos (multipart/form-data), com uma barra de progresso em tempo real (0 a 100%) para o usuário.

Streaming de Vídeo: Um endpoint de streaming dedicado (/api/videos/{id}/stream) que serve os arquivos de vídeo do HD do servidor com suporte a byte-range, permitindo que o player do navegador avance e retorne no vídeo de forma eficiente.

Gestão de Acessos:

CRUD completo de Usuários e Grupos: APIs prontas para gerenciar usuários e seus respectivos grupos.

Estrutura de Segurança: Base para autenticação com Spring Security e JWT, incluindo criptografia de senhas (BCrypt) e endpoints de registro e login.

Interface Moderna (Frontend):

Páginas Dinâmicas: Componentes React que consomem os dados da API em tempo real, eliminando dados estáticos.

Navegação e Layout: Estrutura de rotas com react-router-dom e layouts condicionais para páginas públicas (Login) e privadas (Dashboard).

Player de Vídeo Integrado: A página do player busca dinamicamente a "playlist" de vídeos do mesmo catálogo e reproduz o vídeo com sucesso via streaming do backend.

🛠️ Tecnologias Utilizadas
Backend (Java / Spring Boot)
Java 17

Spring Boot 3

Spring Data JPA / Hibernate: Para persistência de dados.

Spring Security: Para a estrutura de segurança e autenticação.

PostgreSQL: Nosso banco de dados relacional.

Docker: Para rodar o ambiente do PostgreSQL de forma isolada e consistente.

Maven: Gerenciador de dependências do projeto.

Lombok: Para reduzir código boilerplate.

JWT (jsonwebtoken): Para a futura implementação de autenticação baseada em token.

Frontend (React / Vite)
React 18

Vite: Ambiente de desenvolvimento rápido e moderno.

React Router DOM v6: Para o roteamento e navegação entre páginas.

Bootstrap & Bootstrap Icons: Para a base de estilos e iconografia.

CSS Moderno: Estilização com Flexbox, Grid e animações.

⚙️ Como Rodar o Projeto
Para executar este projeto localmente, siga os passos abaixo.

Pré-requisitos
Java JDK 17+

Maven 3.8+

Node.js e npm

Docker Desktop

1. Backend
Inicie o Banco de Dados: Use o Docker para subir um contêiner do PostgreSQL. Lembre-se de definir uma senha.

docker run --name souzalink-db -e POSTGRES_PASSWORD=sua_senha_aqui -p 5432:5432 -v souzalink_database:/var/lib/postgresql/data -d postgres

Crie as Tabelas: Use uma ferramenta como pgAdmin ou DBeaver para conectar ao seu contêiner e execute o script SQL para criar o banco reproducao e todas as tabelas.

Configure a Conexão: No arquivo src/main/resources/application.properties, ajuste a URL, usuário e senha do banco de dados.

Rode a Aplicação: Navegue até a pasta raiz do projeto backend e execute:

./mvnw spring-boot:run

2. Frontend
Instale as Dependências: Navegue até a pasta raiz do projeto frontend e execute:

npm install

Rode o Servidor de Desenvolvimento:

npm run dev

Acesse a aplicação em http://localhost:5173 (ou a porta indicada pelo Vite).

🚀 Próximos Passos
O projeto tem uma base sólida e está pronto para evoluir! Os próximos grandes passos são:

Implementar o fluxo de Login completo no Frontend.

Proteger as rotas no Backend, exigindo um token JWT.

Desenvolver o sistema de progresso de cursos.

Criar o Dashboard dinâmico com dados do usuário logado.

Construir as telas de gerenciamento do Painel Admin.

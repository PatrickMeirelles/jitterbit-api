# Jitterbit API

Este projeto é uma API CRUD para inserção e gerenciamento de Pedidos, desenvolvido em JavaScript utilizando Node.js e Express, com PostgreSQL como banco de dados. O banco de dados está hospedado no Neon Database.

## Funcionalidades

- **Criar Pedido:** Cria um novo pedido e insere os itens associados.
- **Consultar Pedidos:** Obtém a lista de todos os pedidos ou um pedido específico por ID.
- **Atualizar Pedido:** Atualiza os detalhes de um pedido específico.
- **Excluir Pedido:** Remove um pedido específico do banco de dados.

## Tecnologias Utilizadas

- **Node.js:** Plataforma de desenvolvimento.
- **Express:** Framework para construção da API.
- **PostgreSQL:** Banco de dados relacional.
- **Neon Database:** Hospedagem do banco de dados.

## Requisitos

- **Node.js** (versão 14 ou superior)
- **PostgreSQL**

## Instalação

1. Clone o repositório:
   git clone https://github.com/seu-usuario/jitterbit-api.git
   cd jitterbit-api

2. Instale as dependências:
   npm install

3. Configure as variáveis de ambiente:
   Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
   PGHOST=seu_host
   PGDATABASE=seu_database
   PGUSER=seu_usuario
   PGPASSWORD=sua_senha
   PGPORT=sua_porta

4. Execute o script:
   node createTables.js

5. Inicie o servidor:
   node server.js

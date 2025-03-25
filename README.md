# Backend Auth Task

Este projeto é um backend desenvolvido com Node.js, Koa.js, TypeORM, PostgreSQL e o AWS Cognito seguindo os princípios da Clean Architecture.

## Requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started) (caso deseje rodar o projeto com contêineres)
- [PostgreSQL](https://www.postgresql.org/) (caso deseje rodar sem Docker)

---

## 🚀 Como rodar o projeto

### Rodando com Docker

1. Clone o repositório e acesse a pasta do projeto:

   ```sh
   git clone https://github.com/seu-usuario/backend-interview-task.git
   cd backend-interview-task
   ```

2. Construa e suba os contêineres:

   ```sh
   docker-compose up --build
   ```

3. O servidor estará rodando em `http://localhost:3000`

---

### Rodando sem Docker

1. Clone o repositório e acesse a pasta do projeto:

   ```sh
   git clone https://github.com/LeoMendes475/backend-interview-task.git
   cd backend-interview-task
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` na raiz do projeto com os seguintes valores:

     ```env
     # PostgreSQL
      DB_HOST=localhost
      DB_PORT=5432
      DB_USER=postgres
      DB_PASSWORD=postgres
      DB_NAME=UserIdentityDB
      PORT=3000
      
      # PgAdmin
      PGADMIN_EMAIL=admin@example.com
      PGADMIN_PASSWORD=admin
      
      #AWS Cognito
      COGNITO_USER_POOL_ID = '' # Substitua pelo seu User Pool ID
      COGNITO_REGION = '' # Região do seu pool
      COGNITO_APP_CLIENT_ID = ''
      COGNITO_APP_CLIENT_SECRET = ''
     ```

4. Execute as migrations para configurar o banco de dados:

   ```sh
   npm run db:migrate
   ```

5. Inicie o servidor:

   ```sh
   npm run dev
   ```

6. O servidor estará rodando em `http://localhost:3000`

---

## 🔗 Repositório do Postman

Adicione aqui o link para os repositórios do Postman com as requisições da API.

[🔗 Coleção do Postman]([#](https://www.postman.com/aviation-geoscientist-6898586/workspace/backend-interview-task/collection/27038375-aafc7135-1ded-4307-8d9c-a95d91775a53?action=share&creator=27038375&active-environment=27038375-7446c609-05bc-4fcc-830f-c77e553cdee9))
https://www.postman.com/aviation-geoscientist-6898586/workspace/backend-interview-task/collection/27038375-aafc7135-1ded-4307-8d9c-a95d91775a53?action=share&creator=27038375&active-environment=27038375-7446c609-05bc-4fcc-830f-c77e553cdee9


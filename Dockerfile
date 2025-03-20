# Usa a imagem oficial do Node.js 18 como base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências primeiro para otimizar cache
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Compila a aplicação
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Executa as migrations antes de iniciar a aplicação
CMD ["sh", "-c", "npm run db:migrate && npm run start:prod"]

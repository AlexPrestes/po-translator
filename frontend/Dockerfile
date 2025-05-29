# Usa uma imagem Node.js para a fase de build
FROM node:20-alpine as build-stage

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do frontend (incluindo src/, style.css, etc.)
COPY . .

# Roda o comando de build do Vite
# O comando 'npm run build' é definido no package.json do Vite
RUN npm run build

# Usa uma imagem Nginx para servir os arquivos estáticos
FROM nginx:alpine as production-stage

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração do Nginx do seu projeto
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos estáticos gerados pelo Vite para o diretório do Nginx
# O Vite cria uma pasta 'dist' por padrão
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]

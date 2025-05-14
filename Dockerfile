# Usar imagem do NGINX
FROM nginx:alpine

# Remover a página padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar o build do React para o diretório público do nginx
COPY dist/ /usr/share/nginx/html

# Expor a porta
EXPOSE 80

# Iniciar o nginx (já é o padrão, só pra clareza)
CMD ["nginx", "-g", "daemon off;"]

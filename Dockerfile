# Usar uma imagem base do nginx
FROM nginx:alpine

# Copiar os arquivos do frontend para o diretório de conteúdo padrão do nginx
COPY . /usr/share/nginx/html

# A porta padrão em que o nginx serve o conteúdo é 80
EXPOSE 80

# O comando padrão do nginx inicia o servidor
CMD ["nginx", "-g", "daemon off;"]

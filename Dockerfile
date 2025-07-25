# Этап сборки
FROM node:16 AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Этап сервера (используем Nginx)
FROM nginx:alpine

# Копируем собранные файлы в Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

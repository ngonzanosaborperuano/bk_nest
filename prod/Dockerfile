FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start:dev"]

#PROD
## Etapa 1: Build - Instala dependencias y compila el código
#FROM node:22-alpine AS build
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#RUN npm run build
#
## Etapa 2: Production - Copia solo lo necesario para ejecutar la aplicación
#FROM node:22-alpine
#
## Instala 'dumb-init' para gestionar señales correctamente
#RUN apk add --no-cache dumb-init
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#RUN npm install --omit=dev
#
#COPY --from=build /usr/src/app/dist ./dist
#
## Ejecuta la aplicación como un usuario no-root por seguridad
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup
#USER appuser
#
## Usa dumb-init para iniciar la aplicación
#CMD ["dumb-init", "node", "dist/main"] 


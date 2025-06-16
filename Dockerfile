# Etapa 1: Build (usa tu misma versión de Node para consistencia)
FROM node:22.1.0-alpine AS builder

WORKDIR /app

# Copiamos solo lo necesario primero (mejor caché)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto NestJS
RUN npm run build

# Etapa 2: Producción
FROM node:22.1.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Si tienes .env de producción, cópialo o usa --env-file en docker run
COPY .env .env

CMD ["node", "dist/main.js"]

FROM node:22

# Define el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Expone el puerto que usará la aplicación
EXPOSE 3002

# El comando por defecto, que puede ser sobreescrito por docker-compose
CMD [ "npm", "run", "start:dev" ]

# 1. Abre la Terminal

# 2. Instala Homebrew (si no lo tienes)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

# 3. Instala MongoDB Community Edition

Primero, añade el repositorio oficial de MongoDB:

```bash
brew tap mongodb/brew
```

Ahora instala MongoDB:

```bash
brew install mongodb-community@7.0
```

Puedes cambiar 7.0 por la versión que prefieras, como 6.0.

# 4. Inicia MongoDB como servicio en segundo plano

```bash
brew services start mongodb-community@7.0
```

# 5. Verifica que está funcionando

Escribe:

```bash
mongosh
```

Esto abre la consola interactiva de MongoDB. Si ves un prompt con > ya estás dentro.

Ejemplo de comandos:

```bash
show dbs
use test
db.usuarios.insertOne({ nombre: "Ana", edad: 25 })
db.usuarios.find()
```

# Instalar con Homebrew mongodb-compass (alternativa técnica)

Si ya usas Homebrew, puedes instalarlo así:

```bash
brew install --cask mongodb-compass
```

✅ Cómo conectarte a tu base de datos local
Abre MongoDB Compass.

En el campo de conexión (Connection String), escribe:

```bash
mongodb://localhost:27017
```

Haz clic en Connect.

# ✅ Docker Composable

## 🧱 Paso 1: Crea un archivo docker-compose.yml

Abre tu terminal y crea una carpeta para tu proyecto:

```bash
mkdir mi-mongo && cd mi-mongo
```

Crea un archivo llamado docker-compose.yml con este contenido:

```yaml
version: "3.8"

services:
  mongo:
    image: mongo:7
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: miapp
    restart: unless-stopped # <-- esta línea hace que se reinicie automáticamente

volumes:
  mongo_data:
```

Este archivo:

Usa la imagen oficial de MongoDB versión 7.

## ▶️ Paso 2: Levanta MongoDB con Docker Compose

En la misma carpeta donde está el docker-compose.yml, ejecuta:

```bash
docker-compose up -d
```

Esto descargará la imagen y levantará el contenedor en segundo plano (-d = detached mode).

## 🔍 Paso 3: Verifica que esté funcionando

Puedes ver los contenedores corriendo con:

```bash
docker ps
```

También puedes acceder al shell de MongoDB así:

```bash
docker exec -it mongodb mongosh
```

### 🛑 Apagar el servicio

Para detener los contenedores:

```bash
docker-compose down
```

# 🐘 Parte 1: PostgreSQL con Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    container_name: postgresdb
    restart: unless-stopped
    environment:
      POSTGRES_DB: miapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## levantar docker

```bash
docker-compose up -d
```

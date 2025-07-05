# 1. Detén todos los contenedores

docker stop $(docker ps -aq)

# 2. Elimina todos los contenedores

docker rm $(docker ps -aq)

# 3. Elimina todas las imágenes

docker rmi -f $(docker images -q)

# 4. Elimina volúmenes

docker volume prune -f

# 5. Elimina redes

docker network prune -f

=======================================

# levantar toda la imagen y contenedores

docker-compose up --build -d

nota: siempre debe llamarse docker-compose.yml sino
tendria que ser explicito al llamarlo
docker-compose -f docker-compose_dev.yml -f docker-compose.override.yml up --build -d

# REINICIAR es el mismo que cuando levantas

docker-compose up --build -d

# ver logs primer plano osea en consola ves siempre los logs

docker logs -f cocinando_nest

# corre en segundo plano

docker-compose up -d --build

# Comandos Docker útiles para manejo de archivos y base de datos

## Copiar un archivo desde tu máquina al contenedor

```bash
docker cp /Users/niltongonzano/Downloads/db_cocinando.sql postgres:/db_cocinando.sql
```

## Ejecutar un comando dentro del contenedor para importar una base de datos

```bash
docker exec -e PGPASSWORD=2go9fanFPSWCLXGu5JyMmeAMSem1 postgres \
psql -U user -d db_cocinando -f /db_cocinando.sql
```

## Eliminar un archivo dentro del contenedor

```bash
docker exec postgres rm /db_cocinando.sql
```

---

## Otros ejemplos útiles

### Listar todos los contenedores activos

```bash
docker ps
```

### Listar todos los contenedores (incluidos los detenidos)

```bash
docker ps -a
```

### Ver logs de un contenedor

```bash
docker logs nombre_o_id_del_contenedor
```

### Acceder a una terminal bash dentro de un contenedor

```bash
docker exec -it nombre_o_id_del_contenedor bash
```

### Detener un contenedor

```bash
docker stop nombre_o_id_del_contenedor
```

### Iniciar un contenedor detenido

```bash
docker start nombre_o_id_del_contenedor
```

### Eliminar un contenedor detenido

```bash
docker rm nombre_o_id_del_contenedor
```

### Eliminar una imagen

```bash
docker rmi nombre_o_id_de_la_imagen
```

### Ver el uso de espacio de Docker

```bash
docker system df
```

### Limpiar recursos no utilizados (contenedores, imágenes, volúmenes, redes)

```bash
docker system prune -a
```

---

> **Nota:** Cambia `nombre_o_id_del_contenedor` y `nombre_o_id_de_la_imagen` por los valores reales según tu caso.

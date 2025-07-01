# Proyecto de CocinandoIA - Backend

Este proyecto contiene el backend para la aplicación de recetas, construido con NestJS y desplegado en un entorno contenerizado con Docker. Incluye una amplia gama de servicios para asegurar un desarrollo robusto, monitorización y escalabilidad.

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (generalmente viene con Docker Desktop)

## 🚀 Primeros Pasos

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd bk_recetas
    ```

2.  **Configurar Variables de Entorno:**
    El proyecto utiliza un archivo `.env` para gestionar toda la configuración. Renombra o copia el archivo `dev` a `.env` o créalo desde cero. Este archivo centraliza todos los secretos y configuraciones de puertos.

3.  **Iniciar el Stack:**
    Para levantar todos los servicios en segundo plano (modo "detached"), usa el siguiente comando:
    ```bash
    docker-compose up -d --build
    ```
    El flag `--build` es importante la primera vez para construir la imagen de la aplicación.

## ⚙️ Gestión del Stack

- **Ver estado de los contenedores:**
  ```bash
  docker-compose ps
  ```
- **Detener todos los servicios:**
  ```bash
  docker-compose down
  ```
- **Detener y eliminar volúmenes (reseteo completo):**
  ```bash
  docker-compose down -v
  ```

## 📊 Tabla de Servicios y Mantenimiento

A continuación se detallan todos los servicios del stack, sus URLs de acceso y comandos útiles para mantenimiento.

| Servicio                | Puerto (Host) | URL de Acceso                                    | Ver Logs                          | Mantenimiento / Comandos Útiles                                                    |
| :---------------------- | :------------ | :----------------------------------------------- | :-------------------------------- | :--------------------------------------------------------------------------------- |
| 📦 **NestJS App**       | 3002          | [http://localhost:3002](http://localhost:3002)   | `docker logs -f cocinando_nest`   | Conectarse al shell del contenedor: `docker exec -it cocinando_nest sh`            |
| 🐘 **PostgreSQL**       | 5432          | N/A                                              | `docker logs -f postgres`         | Conectarse con psql: `docker exec -it postgres psql -U user -d recetasdb`          |
| 🧑‍💻 **PGAdmin**          | 5050          | [http://localhost:5050](http://localhost:5050)   | `docker logs -f pgadmin`          | Usa las credenciales del `.env` para entrar.                                       |
| 🗄️ **Redis**            | 6379          | N/A                                              | `docker logs -f redis`            | Conectarse a la CLI: `docker exec -it redis redis-cli` (luego usa `AUTH password`) |
| 🐇 **RabbitMQ**         | 15672         | [http://localhost:15672](http://localhost:15672) | `docker logs -f rabbitmq`         | Usa las credenciales del `.env` para entrar.                                       |
| 🪣 **Minio**            | 9001          | [http://localhost:9001](http://localhost:9001)   | `docker logs -f minio`            | Almacenamiento de objetos compatible con S3.                                       |
| 📊 **Grafana**          | 3010          | [http://localhost:3010](http://localhost:3010)   | `docker logs -f grafana`          | Visualización de métricas y dashboards.                                            |
| 🍃 **MongoDB**          | 27017         | N/A                                              | `docker logs -f mongodb`          | Conectarse al shell: `docker exec -it mongodb mongosh -u user -p password`         |
| 🍃 **Mongo Express**    | 8081          | [http://localhost:8081](http://localhost:8081)   | `docker logs -f mongo-express`    | Interfaz web para MongoDB.                                                         |
| ✈️ **NATS**             | 8222          | [http://localhost:8222](http://localhost:8222)   | `docker logs -f nats`             | Servidor de mensajería de alta performance.                                        |
| 🦟 **Mosquitto**        | 1883          | N/A                                              | `docker logs -f mqtt`             | Broker de mensajería MQTT.                                                         |
| 🦁 **Zookeeper**        | 2181          | N/A                                              | `docker logs -f zookeeper`        | Conectarse a la CLI: `docker exec -it zookeeper zookeeper-shell localhost:2181`    |
| 📝 **Kafka**            | 9092          | N/A                                              | `docker logs -f kafka`            | Plataforma de streaming de eventos.                                                |
| 🐼 **Redpanda Console** | 8082          | [http://localhost:8082](http://localhost:8082)   | `docker logs -f redpanda-console` | Interfaz web para Kafka.                                                           |
| 🔍 **Elasticsearch**    | 9200          | [http://localhost:9200](http://localhost:9200)   | `docker logs -f elasticsearch`    | Motor de búsqueda y analítica.                                                     |
| 📈 **Kibana**           | 5601          | [http://localhost:5601](http://localhost:5601)   | `docker logs -f kibana`           | Interfaz para visualizar y gestionar datos en Elasticsearch.                       |
| 🔥 **Prometheus**       | 9090          | [http://localhost:9090](http://localhost:9090)   | `docker logs -f prometheus`       | Base de datos de series temporales y sistema de alertas.                           |

---

## 🔧 Solución de Problemas

### Kafka en Bucle de Reinicio (`CLUSTER_ID is required`)

Las versiones modernas de Kafka usan KRaft y requieren un `CLUSTER_ID` único. Si el contenedor de Kafka entra en un bucle de reinicios y los logs muestran el error `CLUSTER_ID is required`, sigue estos pasos:

1.  **Asegúrate de que los contenedores estén detenidos:**

    ```bash
    docker-compose down
    ```

2.  **Genera un nuevo CLUSTER_ID:**
    Ejecuta el siguiente comando. Este iniciará un contenedor temporal de Kafka solo para usar su herramienta de generación de UUID y luego lo eliminará.

    ```bash
    docker-compose run --rm kafka kafka-storage random-uuid
    ```

3.  **Copia el ID generado:**
    La terminal te devolverá un ID único (ej: `zJ8_zJ8_Tj2a_zJ8_zJ8_zQ`). Copia esta cadena.

4.  **Actualiza el `docker-compose.yml`:**
    Abre el archivo `docker-compose.yml`, busca el servicio de `kafka` y pega el nuevo ID en la variable de entorno `CLUSTER_ID`.

    ```yaml
    kafka:
      # ...
      environment:
        # ...
        CLUSTER_ID: "AQUI_VA_EL_NUEVO_ID_COPIADO"
        # ...
    ```

5.  **Reinicia el stack con los volúmenes limpios:**
    Es crucial usar `-v` para eliminar el estado antiguo que causaba el conflicto.
    ```bash
    docker-compose down -v && docker-compose up -d --build
    ```

Esto debería resolver el problema y permitir que Kafka se inicie correctamente.

---

## 👨‍💻 Guía de Uso de Servicios desde el Código

Aquí tienes una guía completa, desde lo más básico hasta conceptos avanzados, sobre cómo interactuar con cada servicio de tu proyecto desde el código de tu aplicación NestJS.

### **1. PostgreSQL (Base de Datos Relacional)**

- **Utilidad:** Base de datos relacional robusta y de código abierto. Ideal para datos estructurados que requieren consistencia (transacciones ACID), como perfiles de usuario, pedidos, productos, etc.
- **Ejemplo de Conexión (`app.module.ts`):** (La configuración se gestiona a través de los módulos de configuración de NestJS, inyectando las variables de entorno).
- **Niveles de Uso:**
  - **Básico:** Crear un CRUD (Crear, Leer, Actualizar, Borrar) para una entidad simple, como `User`. Inyectar el repositorio de TypeORM en un servicio y usar métodos como `find()`, `findOne()`, `save()` y `remove()`.
  - **Intermedio:** Implementar relaciones entre entidades. Por ejemplo, un `User` tiene múltiples `Posts` (`@OneToMany`). Realizar consultas que unan estas tablas (`relations: ['posts']`) y gestionar la lógica de negocio que involucra a ambas entidades.
  - **Avanzado:** Utilizar `QueryRunner` para ejecutar transacciones complejas. Por ejemplo, en un proceso de compra, registrar el `Order`, actualizar el `Stock` del producto y procesar el `Payment` como una operación atómica. Si algo falla, se revierte todo para mantener la consistencia de los datos.

### **2. Redis (Caché y Mensajería Rápida)**

- **Utilidad:** Almacén de datos en memoria extremadamente rápido. Se usa principalmente como caché para reducir la carga en las bases de datos principales y acelerar las respuestas de la API.
- **Ejemplo de Conexión (usando `cache-manager`):** (La configuración se gestiona a través de los módulos de configuración de NestJS, inyectando las variables de entorno).
- **Niveles de Uso:**
  - **Básico:** Cachear la respuesta de un endpoint que raramente cambia, como una lista de categorías de productos. Se usa un interceptor de NestJS que guarda el resultado en Redis la primera vez y lo sirve desde allí en peticiones posteriores.
  - **Intermedio:** Implementar un sistema de "rate limiting" para un endpoint específico. Se usa Redis para almacenar un contador por IP o por usuario, incrementándolo con cada petición y bloqueando si se supera un umbral en un período de tiempo determinado.
  - **Avanzado:** Usar Redis como una cola de trabajos simple para tareas de baja prioridad. Por ejemplo, cuando un usuario pide un reporte, se añade una tarea a una lista de Redis con `LPUSH`. Un worker separado escucha esa lista con `BRPOP`, genera el reporte en segundo plano y notifica al usuario cuando está listo.

### **3. RabbitMQ (Message Broker)**

- **Utilidad:** Bróker de mensajes robusto que implementa el protocolo AMQP. Ideal para desacoplar servicios (microservicios), asegurar la entrega de mensajes y procesar tareas en segundo plano.
- **Ejemplo de Conexión (como microservicio NestJS):** (La conexión del microservicio se define en el `main.ts` utilizando las variables de entorno correspondientes).
- **Niveles de Uso:**
  - **Básico:** Un servicio `Auth` publica un mensaje `user_registered` en una cola simple (ej. `user_events`) cada vez que un nuevo usuario se registra.
  - **Intermedio:** Un servicio de `Notifications` consume los mensajes de la cola `user_events` para enviar un correo de bienvenida. El mensaje no se elimina de la cola hasta que el correo se envía con éxito (usando `ack`), asegurando la entrega.
  - **Avanzado:** Implementar el patrón `Saga` para orquestar transacciones distribuidas. Un servicio de `Orders` inicia la saga publicando un evento. Múltiples servicios (`Billing`, `Shipping`, `Inventory`) escuchan y responden, publicando sus propios eventos. Si un paso falla, se publican eventos de compensación para revertir los pasos anteriores. Se usan `Topic Exchanges` para enrutar los eventos a los consumidores correctos.

### **4. MongoDB (Base de Datos NoSQL)**

- **Utilidad:** Base de datos NoSQL orientada a documentos. Excelente para datos no estructurados o semi-estructurados que evolucionan rápidamente. Su flexibilidad permite un desarrollo más ágil.
- **Ejemplo de Conexión (`app.module.ts`):** (La configuración se gestiona a través de los módulos de configuración de NestJS, inyectando las variables de entorno).
- **Niveles de Uso:**
  - **Básico:** Guardar documentos flexibles, como logs de eventos de la aplicación. Cada log puede tener una estructura ligeramente diferente, y MongoDB la aceptará sin problemas.
  - **Intermedio:** Crear un sistema de comentarios para un blog. Un documento `Post` contiene un array de sub-documentos `Comment`. Esto permite recuperar una publicación y todos sus comentarios en una sola consulta.
  - **Avanzado:** Implementar el `Aggregation Pipeline` para generar reportes complejos. Por ejemplo, calcular el "producto más vendido del mes" agrupando datos de una colección de `Orders`, sumando cantidades y ordenando los resultados, todo dentro de una sola consulta a la base de datos.

### **5. Minio (Almacenamiento de Objetos S3)**

- **Utilidad:** Almacenamiento de objetos de alto rendimiento compatible con la API de Amazon S3. Perfecto para guardar archivos grandes como imágenes, videos, backups o cualquier tipo de dato no estructurado.
- **Ejemplo de Conexión (usando `aws-sdk`):** (La conexión se establece instanciando el cliente S3 con las variables de entorno de Minio).
- **Niveles de Uso:**
  - **Básico:** Un endpoint de la API recibe una imagen para el perfil de un usuario, la sube a un "bucket" de Minio y guarda la URL del objeto en la base de datos de PostgreSQL junto al perfil del usuario.
  - **Intermedio:** Generar una "URL pre-firmada" (`presigned URL`) con una validez de 5 minutos. El servidor envía esta URL al cliente (frontend), y el frontend la usa para subir un archivo grande directamente a Minio, sin que los datos pasen por el servidor de la aplicación.
  - **Avanzado:** Configurar una política de ciclo de vida en un bucket de Minio. Por ejemplo, los archivos en el bucket `logs` se mueven automáticamente a un "storage class" más económico después de 30 días y se eliminan permanentemente después de 365 días para gestionar costos y cumplir con políticas de retención.

### **6. Kafka (Plataforma de Streaming de Eventos)**

- **Utilidad:** Plataforma de streaming de eventos distribuida, diseñada para alta ingesta de datos y persistencia. Ideal para `event sourcing`, análisis en tiempo real y como bus de eventos central en arquitecturas de microservicios.
- **Ejemplo de Conexión (como microservicio NestJS):** (La conexión del microservicio se define en el `main.ts` utilizando las variables de entorno correspondientes).
- **Niveles de Uso:**
  - **Básico:** Un servicio `API Gateway` publica cada petición recibida (ej. `GET /products/123`) a un tópico de Kafka llamado `api_logs`.
  - **Intermedio:** Un servicio de `Analytics` consume el flujo de `api_logs` en tiempo real, cuenta las peticiones por ruta y las muestra en un dashboard. El consumidor pertenece a un `consumer group` para poder escalar si el tráfico aumenta.
  - **Avanzado:** Implementar `Event Sourcing`. El estado de una entidad (ej. una `Order`) no se guarda en una tabla, sino que se reconstruye a partir de la secuencia de eventos inmutables (`order_created`, `item_added`, `order_shipped`) que se han publicado en un tópico de Kafka para esa orden específica. Esto proporciona un historial de auditoría completo.

---

## Acceso a CLIs de Servicios (vía Docker Exec)

Para depurar o interactuar directamente con los servicios, puedes usar `docker exec` para acceder a sus herramientas de línea de comando.

### PostgreSQL

Para acceder a la consola `psql`:

```bash
docker exec -it postgres psql -U <user> -d <name base de datos>
```

Se te pedirá la contraseña, que está en tu archivo `.env`.

### Redis

Para acceder a la `redis-cli`:

```bash
docker exec -it redis redis-cli
```

Una vez dentro, debes autenticarte:

```redis
AUTH tu_password_de_redis_aqui
```

Comandos útiles: `KEYS *`, `GET mi_key`, `FLUSHALL` (borra todo).

### MongoDB

Para acceder a la `mongosh` (Mongo Shell):

```bash
docker exec -it mongodb mongosh -u <user> -p <password>
```

### Kafka

Para interactuar con los tópicos de Kafka:

- **Listar todos los tópicos:**
  ```bash
  docker exec -it kafka kafka-topics --bootstrap-server kafka:29092 --list
  ```
- **Producir un mensaje en un tópico:**
  ```bash
  docker exec -it kafka kafka-console-producer --bootstrap-server kafka:29092 --topic nombre_del_topico
  ```
  (Escribe tu mensaje y presiona Enter)
- **Consumir mensajes de un tópico:**
  ```bash
  docker exec -it kafka kafka-console-consumer --bootstrap-server kafka:29092 --topic nombre_del_topico --from-beginning
  ```

### RabbitMQ

Para usar las herramientas de administración de RabbitMQ:

```bash
docker exec -it rabbitmq rabbitmqctl list_queues
```

Puedes cambiar `list_queues` por otros comandos como `list_exchanges`, `list_bindings`, etc.

### MQTT (Mosquitto)

El contenedor de Mosquitto incluye clientes de publicación y suscripción.

- **Suscribirse a un tópico para ver mensajes:**
  ```bash
  docker exec -it mqtt mosquitto_sub -h localhost -t "test/topic" -v
  ```
- **Publicar un mensaje en un tópico (en otra terminal):**
  ```bash
  docker exec -it mqtt mosquitto_pub -h localhost -t "test/topic" -m "Hola MQTT!"
  ```

### Elasticsearch

Elasticsearch se maneja principalmente a través de su API REST con `curl`.

- **Ver la salud del cluster:**
  ```bash
  docker exec -it elasticsearch curl "localhost:9200/_cat/health?v"
  ```
- **Listar todos los índices:**
  ```bash
  docker exec -it elasticsearch curl "localhost:9200/_cat/indices?v"
  ```

### Shell Genérica del Contenedor

Para cualquier otro contenedor, si necesitas explorar su sistema de archivos, puedes abrir una shell:

```bash
docker exec -it nombre_del_contenedor /bin/sh
```

(Reemplaza `nombre_del_contenedor` por `minio`, `nats`, etc.)

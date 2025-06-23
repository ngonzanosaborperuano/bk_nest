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
| 📦 **NestJS App**       | 3000          | [http://localhost:3000](http://localhost:3000)   | `docker logs -f cocinando_nest`   | Conectarse al shell del contenedor: `docker exec -it cocinando_nest sh`            |
| 🐘 **PostgreSQL**       | 5432          | N/A                                              | `docker logs -f postgres`         | Conectarse con psql: `docker exec -it postgres psql -U user -d recetasdb`          |
| 🧑‍💻 **PGAdmin**          | 5050          | [http://localhost:5050](http://localhost:5050)   | `docker logs -f pgadmin`          | Usa las credenciales del `.env` para entrar.                                       |
| 🗄️ **Redis**            | 6379          | N/A                                              | `docker logs -f redis`            | Conectarse a la CLI: `docker exec -it redis redis-cli` (luego usa `AUTH password`) |
| 🐇 **RabbitMQ**         | 15672         | [http://localhost:15672](http://localhost:15672) | `docker logs -f rabbitmq`         | Usa las credenciales del `.env` para entrar.                                       |
| 🪣 **Minio**            | 9001          | [http://localhost:9001](http://localhost:9001)   | `docker logs -f minio`            | Almacenamiento de objetos compatible con S3.                                       |
| 📊 **Grafana**          | 3002          | [http://localhost:3002](http://localhost:3002)   | `docker logs -f grafana`          | Visualización de métricas y dashboards.                                            |
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

- **Utilidad:** Es tu base de datos principal para datos estructurados (usuarios, productos, pedidos, etc.). Usamos `TypeORM` como ORM para interactuar con ella.
- **Uso Básico (Ya configurado):**

  - **Conexión:** `TypeOrmModule` en tu `app.module.ts` ya se encarga de la conexión usando las variables de `database.config.ts`.
  - **Interactuar:**

    1.  **Crea una Entidad:** Define la estructura de tu tabla.

        ```typescript
        // src/user/user.entity.ts
        import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

        @Entity()
        export class User {
          @PrimaryGeneratedColumn()
          id: number;

          @Column()
          name: string;
        }
        ```

    2.  **Inyecta el Repositorio:** En tu servicio, inyecta el repositorio de la entidad para acceder a los métodos de la base de datos (`find`, `save`, `delete`, etc.).

        ```typescript
        // src/user/users.service.ts
        import { Injectable } from "@nestjs/common";
        import { InjectRepository } from "@nestjs/typeorm";
        import { Repository } from "typeorm";
        import { User } from "./user.entity";

        @Injectable()
        export class UsersService {
          constructor(
            @InjectRepository(User)
            private usersRepository: Repository<User>
          ) {}

          findAll(): Promise<User[]> {
            return this.usersRepository.find();
          }
        }
        ```

- **Uso Avanzado:**
  - **Migraciones:** Gestiona cambios en el esquema de tu base de datos de forma versionada.
  - **Relaciones:** Define relaciones entre entidades (`@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`).
  - **Transacciones:** Asegura la integridad de los datos agrupando múltiples operaciones en una sola unidad de trabajo.

### **2. Redis (Caché y Mensajería Rápida)**

- **Utilidad:** Base de datos en memoria ultrarrápida. Ideal para caching, gestión de sesiones, y como un simple Pub/Sub.
- **Uso Básico:**

  1.  **Instala el cliente:** `npm install ioredis`
  2.  **Crea un proveedor de Redis:**

      ```typescript
      // src/common/cache/redis.provider.ts
      import { Provider } from "@nestjs/common";
      import Redis from "ioredis";

      export const REDIS_CLIENT = "REDIS_CLIENT";

      export const redisProvider: Provider = {
        provide: REDIS_CLIENT,
        useFactory: () => {
          return new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD,
          });
        },
      };
      ```

  3.  **Inyéctalo y úsalo:**

      ```typescript
      import { Injectable, Inject } from "@nestjs/common";
      import { Redis } from "ioredis";
      import { REDIS_CLIENT } from "./redis.provider";

      @Injectable()
      export class MyService {
        constructor(
          @Inject(REDIS_CLIENT) private readonly redisClient: Redis
        ) {}

        async cacheSomething(key: string, value: string) {
          // Guarda un valor en caché por 1 hora
          await this.redisClient.set(key, value, "EX", 3600);
        }

        async getSomething(key: string): Promise<string> {
          return await this.redisClient.get(key);
        }
      }
      ```

- **Uso Avanzado:**
  - **Caching Automático:** Crea un interceptor o decorador en NestJS para cachear automáticamente los resultados de funciones.
  - **Redis Streams:** Úsalo como un "mini-Kafka" para flujos de eventos persistentes.
  - **Rate Limiting:** Almacena contadores de peticiones por IP o usuario para limitar el acceso.

### **3. RabbitMQ (Message Broker)**

- **Utilidad:** Para comunicación asíncrona entre microservicios. Permite desacoplar servicios y procesar tareas en segundo plano (ej: enviar emails, procesar imágenes).
- **Uso Básico:**

  1.  **Instala la librería:** `npm install amqplib`
  2.  **Crea un "Publisher" (el que envía):**

      ```typescript
      import * as amqp from "amqplib";

      async function publishMessage() {
        const connection = await amqp.connect(
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@localhost:${process.env.RABBITMQ_AMQP_PORT}`
        );
        const channel = await connection.createChannel();
        const queue = "task_queue";
        const msg = { text: "Hello World!" };

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(" [x] Sent '%s'", msg);
      }
      ```

  3.  **Crea un "Consumer" (el que recibe):**

      ```typescript
      // En otro servicio o en el mismo para procesar en segundo plano
      import * as amqp from "amqplib";

      async function consumeMessage() {
        const connection = await amqp.connect(
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@localhost:${process.env.RABBITMQ_AMQP_PORT}`
        );
        const channel = await connection.createChannel();
        const queue = "task_queue";

        await channel.assertQueue(queue, { durable: true });
        channel.consume(
          queue,
          (msg) => {
            console.log(" [x] Received %s", JSON.parse(msg.content.toString()));
          },
          { noAck: true }
        );
      }
      ```

- **Uso Avanzado:**
  - **Patrones de Exchange:** Aprende sobre `Direct`, `Fanout`, y `Topic` exchanges para ruteo de mensajes complejo.
  - **Dead-Letter Queues:** Configura colas para mensajes que no pudieron ser procesados, evitando perderlos.
  - **Integración con NestJS:** Usa el paquete `@nestjs/microservices` con el transporter de RabbitMQ para una integración nativa.

### **4. MongoDB (Base de Datos NoSQL)**

- **Utilidad:** Perfecta para datos no estructurados, semi-estructurados o que cambian con frecuencia (ej: logs, catálogos de productos flexibles, contenido de usuario).
- **Uso Básico (con Mongoose):**

  1.  **Instala librerías:** `npm install mongoose @nestjs/mongoose`
  2.  **Conecta en `app.module.ts`:**

      ```typescript
      import { Module } from "@nestjs/common";
      import { MongooseModule } from "@nestjs/mongoose";

      @Module({
        imports: [
          MongooseModule.forRoot(
            `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/`
          ),
        ],
      })
      export class AppModule {}
      ```

  3.  **Crea un Schema y úsalo:**

      ```typescript
      import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
      import { Document } from "mongoose";

      @Schema()
      export class Product extends Document {
        @Prop()
        name: string;

        @Prop({ type: Object }) // Para datos flexibles
        attributes: Record<string, any>;
      }

      export const ProductSchema = SchemaFactory.createForClass(Product);
      ```

- **Uso Avanzado:**
  - **Aggregation Framework:** Realiza transformaciones complejas de datos directamente en la base de datos.
  - **Indexing:** Crea índices para acelerar drásticamente las consultas.
  - **Mongoose Middlewares:** Ejecuta lógica antes o después de operaciones como `save` o `find`.

### **5. Minio (Almacenamiento de Objetos S3)**

- **Utilidad:** Para guardar archivos grandes (imágenes, videos, backups, etc.) de forma escalable y con una API estándar (S3).
- **Uso Básico:**

  1.  **Instala la librería:** `npm install minio`
  2.  **Crea un cliente y sube un archivo:**

      ```typescript
      import * as Minio from "minio";

      const minioClient = new Minio.Client({
        endPoint: "localhost",
        port: parseInt(process.env.MINIO_API_PORT, 10),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
      });

      async function uploadFile(
        bucketName: string,
        objectName: string,
        filePath: string
      ) {
        await minioClient.fPutObject(bucketName, objectName, filePath, {});
        console.log("File uploaded successfully.");
      }
      ```

- **Uso Avanzado:**
  - **URLs Pre-firmadas:** Genera URLs temporales para que los usuarios puedan subir o descargar archivos directamente desde el frontend sin exponer tus credenciales.
  - **Políticas de Ciclo de Vida:** Configura reglas para mover archivos a almacenamientos más fríos o borrarlos después de un tiempo.

### **6. Kafka (Plataforma de Streaming de Eventos)**

- **Utilidad:** Es el "sistema nervioso central" para arquitecturas basadas en eventos. Ideal para procesar flujos masivos de datos en tiempo real (telemetría, logs, clickstreams).
- **Uso Básico:**

  1.  **Instala la librería:** `npm install kafkajs`
  2.  **Producer (produce eventos):**

      ```typescript
      import { Kafka } from "kafkajs";

      const kafka = new Kafka({
        brokers: [`localhost:${process.env.KAFKA_EXTERNAL_PORT}`],
      });
      const producer = kafka.producer();

      await producer.connect();
      await producer.send({
        topic: "user-signups",
        messages: [{ value: '{"userId": 1, "email": "test@example.com"}' }],
      });
      ```

  3.  **Consumer (consume eventos):**

      ```typescript
      const consumer = kafka.consumer({ groupId: "my-app-group" });

      await consumer.connect();
      await consumer.subscribe({ topic: "user-signups", fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({ value: message.value.toString() });
        },
      });
      ```

- **Uso Avanzado:**
  - **Consumer Groups:** Escala el procesamiento de eventos haciendo que múltiples instancias de tu servicio trabajen en la misma cola.
  - **Particiones:** Aumenta el paralelismo y el rendimiento dividiendo un topic en múltiples particiones.
  - **Kafka Connect:** Integra Kafka con otras fuentes de datos (como bases de datos) sin escribir código.

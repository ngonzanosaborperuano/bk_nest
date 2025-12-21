-- 1.Tabla de roles
-- Tabla de roles: define los permisos de los usuarios (Administrador, Cocinero, Usuario común)
drop table if exists roles cascade;
CREATE TABLE roles (
    id bigserial PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Inserta los tres roles
INSERT INTO roles (nombre, descripcion) VALUES 
('cocinero', 'Encargado de preparar los alimentos'),
('cliente', 'Persona que realiza pedidos y consume los productos'),
('administrador', 'Encargado de gestionar el sistema y los usuarios');
-- 2.Tabla de usuarios
-- Tabla de usuarios: almacena la información de cada persona que usa la app
drop table if exists usuarios cascade;
CREATE TABLE usuarios (
    id bigserial PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    session_token VARCHAR,
    foto VARCHAR,
	  estado boolean null default true,
    actualizado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2.1 Tabla de usuario_roles
-- Esta tabla enlaza usuarios y roles.
DROP TABLE IF EXISTS usuario_roles CASCADE;
CREATE TABLE usuario_roles (
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, rol_id)
);

-- 🔄 Eliminar la función si ya existe
DROP FUNCTION IF EXISTS find_usuario_por_email(VARCHAR);

-- ✅ Crear función para obtener un usuario por su email y estado activo
CREATE OR REPLACE FUNCTION find_usuario_por_email(p_email VARCHAR)
RETURNS TABLE (
    id BIGINT,
    nombre_completo VARCHAR,
    email VARCHAR,
    contrasena TEXT,
    foto VARCHAR,
    fecha_creacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nombre_completo,
        u.email,
        u.contrasena,
        u.foto,
        u.fecha_creacion
    FROM usuarios u
    WHERE u.email = p_email
      AND u.estado = true;
END;
$$ LANGUAGE plpgsql;

-- 🔄 Eliminar la función si ya existe (para evitar conflicto de firmas)
DROP FUNCTION IF EXISTS find_usuario_por_id(BIGINT);

-- ✅ Crear función para obtener un usuario por su ID
CREATE OR REPLACE FUNCTION find_usuario_por_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    nombre_completo VARCHAR,
    email VARCHAR,
    contrasena TEXT,
    foto VARCHAR,
    fecha_creacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nombre_completo,
        u.email,
        u.contrasena,
        u.foto,
        u.fecha_creacion
    FROM usuarios u
    WHERE u.id = p_id;
END;
$$ LANGUAGE plpgsql;


-- 🔄 Eliminar la función si ya existe
DROP FUNCTION IF EXISTS actualizar_session_token(BIGINT, VARCHAR);

-- ✅ Crear función para actualizar el session_token de un usuario
CREATE OR REPLACE FUNCTION actualizar_session_token(p_id BIGINT, p_token VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE usuarios
    SET session_token = p_token
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
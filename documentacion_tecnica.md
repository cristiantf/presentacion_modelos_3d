# Documentación Técnica

## 1. Arquitectura del Sistema
El proyecto sigue una arquitectura Cliente-Servidor (Frontend y Backend separados lógicamente, pero servidos desde la misma aplicación para facilitar el despliegue).

- **Backend:** Desarrollado en Node.js utilizando el framework Express. Actúa como una API RESTful y también sirve los archivos estáticos del frontend.
- **Frontend:** Aplicación de página única / páginas múltiples ligeras construidas con JavaScript nativo, consumiendo las rutas de la API del servidor.

## 2. Esquema de Base de Datos (MySQL)

La base de datos principal se denomina `feria_3d_db`.

### Tabla: `admins`
| Campo      | Tipo         | Descripción                            |
|------------|--------------|----------------------------------------|
| id         | INT (PK, AI) | Identificador único del administrador  |
| username   | VARCHAR(50)  | Nombre de usuario para el login        |
| password   | VARCHAR(255) | Contraseña encriptada (Bcrypt)         |

### Tabla: `modelos`
| Campo       | Tipo         | Descripción                            |
|-------------|--------------|----------------------------------------|
| id          | INT (PK, AI) | Identificador único del modelo         |
| titulo      | VARCHAR(100) | Título visible en la galería           |
| descripcion | TEXT         | Detalles del proyecto/modelo           |
| file_path   | VARCHAR(255) | Ruta del archivo `.glb` en el servidor |
| uploaded_at | TIMESTAMP    | Fecha y hora de subida                 |

## 3. Especificación de la API (Rutas Express)

### Autenticación
- `POST /api/auth/login`: Autentica al administrador e inicializa la sesión.
- `POST /api/auth/logout`: Destruye la sesión actual.

### Gestión de Modelos
- `GET /api/models`: Retorna la lista en formato JSON de todos los modelos disponibles.
- `GET /api/models/:id`: Retorna la información de un modelo específico.
- `POST /api/admin/models`: (Requiere Autenticación) Sube un nuevo modelo `.glb` (usa `multer`).
- `DELETE /api/admin/models/:id`: (Requiere Autenticación) Elimina un modelo de la BD y el archivo físico.

## 4. Consideraciones de Seguridad
- **Protección de Rutas:** El panel de administración (`/admin.html`) y las rutas `/api/admin/*` están protegidas mediante middleware de verificación de sesión (`express-session`).
- **Validación de Archivos:** El servidor (a través de multer) verifica que los archivos subidos tengan estrictamente la extensión `.glb` para evitar la inyección de código malicioso.

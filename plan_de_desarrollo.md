# Plan de Desarrollo

## 1. Metodología Adoptada: Scrum (Agile)
Para el desarrollo de esta plataforma, adoptaremos una metodología basada en **Scrum**, permitiendo entregas iterativas y adaptabilidad frente a los requerimientos visuales y funcionales de la feria.

- **Duración del Sprint:** 1 Semana.
- **Herramienta de Seguimiento Simulada:** Tablero Kanban (Trello/Jira style).
- **Roles:**
  - *Product Owner:* ISTAE (Define requerimientos visuales, colores y modelos).
  - *Scrum Master / Development Team:* Equipo de desarrollo (Antigravity AI / Desarrollador).

## 2. Fases de Desarrollo (Sprints)

### Sprint 1: Arquitectura y Base de Datos
**Objetivo:** Establecer los cimientos del proyecto.
- [ ] Inicialización del proyecto Node.js (`package.json`).
- [ ] Creación de la base de datos MySQL y tablas (`admins`, `modelos`).
- [ ] Configuración de la conexión a la base de datos en Node (`db.js`).

### Sprint 2: Backend y Autenticación (API)
**Objetivo:** Lógica del servidor y seguridad.
- [ ] Implementación de `express-session`.
- [ ] Desarrollo del endpoint de Login y encriptación de contraseñas.
- [ ] Desarrollo de rutas CRUD para modelos (Subida de archivos con `multer`).

### Sprint 3: Frontend y Diseño UI/UX
**Objetivo:** Interfaz gráfica orientada a la identidad del instituto (Blanco y Azul Claro).
- [ ] Creación de maquetas HTML (`index.html`, `viewer.html`, `admin.html`).
- [ ] Implementación de CSS puro con diseño responsivo, paleta de colores corporativa e integración del logo `logo_ISATE.png`.
- [ ] Integración del componente `<model-viewer>`.

### Sprint 4: Integración y Pruebas
**Objetivo:** Conectar el Frontend con el Backend y asegurar calidad.
- [ ] Consumo de la API desde JS (Fetch API) para mostrar modelos dinámicamente.
- [ ] Pruebas de carga del archivo `.glb` proporcionado por el instituto.
- [ ] Corrección de errores (Bug fixing) y pulido de animaciones.

# Plataforma de Presentación de Modelos 3D - ISTAE

## 📌 Descripción del Proyecto
Este proyecto es una aplicación web interactiva diseñada para la exhibición de modelos 3D (formato `.glb`) durante la Feria del Instituto (ISTAE). Su objetivo principal es ofrecer una experiencia visual moderna e inmersiva (utilizando tonos blanco y azul claro) para los visitantes de la feria, al mismo tiempo que proporciona un panel de administración robusto para la gestión del contenido.

## 🚀 Funcionalidades Principales

### 1. Interfaz Pública (Visitantes)
- **Galería Interactiva:** Catálogo visual de todos los proyectos/modelos 3D disponibles.
- **Visor 3D Integrado:** Capacidad de rotar, hacer zoom y explorar cada modelo de forma inmersiva sin necesidad de software externo (gracias a `<model-viewer>`).
- **Diseño Adaptativo (Responsive):** Experiencia fluida tanto en computadoras de escritorio como en dispositivos móviles y tablets.

### 2. Panel de Administración (Gestores)
- **Autenticación Segura:** Sistema de inicio de sesión exclusivo para administradores.
- **Gestión de Modelos (CRUD):** 
  - Subir nuevos modelos 3D (`.glb`).
  - Editar el título y descripción de modelos existentes.
  - Eliminar modelos obsoletos.
- **Dashboard Estadístico:** Vista general de los modelos actualmente en exhibición.

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5, CSS3 (Vanilla - Blanco/Azul claro), JavaScript.
- **Visor 3D:** Google `<model-viewer>`.
- **Backend:** Node.js, Express.js.
- **Base de Datos:** MySQL.
- **Despliegue:** Preparado para cPanel con soporte Node.js.

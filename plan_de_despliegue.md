# Plan de Despliegue (cPanel)

Este documento detalla los pasos necesarios para llevar la aplicación desde el entorno de desarrollo local (XAMPP/Node local) al entorno de producción en un servidor hosting con cPanel.

## Fase 1: Preparación Local
1. **Verificación de Entorno:** Asegurar que la aplicación funciona correctamente en `localhost`.
2. **Exportación de BD:** Abrir phpMyAdmin en XAMPP local y exportar la base de datos `feria_3d_db` en un archivo `.sql`.
3. **Limpieza:** Eliminar la carpeta `node_modules` del proyecto (se generará nuevamente en el servidor). Comprimir los archivos del proyecto en un archivo `.zip`.

## Fase 2: Configuración de Base de Datos en cPanel
1. Acceder a cPanel y navegar a la sección **Bases de datos MySQL**.
2. Crear una nueva base de datos (ej. `usuario_feria3d`).
3. Crear un nuevo usuario de base de datos con una contraseña segura.
4. Asignar el usuario a la base de datos con **Todos los privilegios**.
5. Acceder a **phpMyAdmin** dentro de cPanel e importar el archivo `.sql` exportado en la Fase 1.
6. Actualizar las credenciales en el archivo `db.js` del código fuente con los nuevos datos de cPanel antes de subirlo.

## Fase 3: Despliegue de la Aplicación Node.js en cPanel
1. En cPanel, navegar a la sección **Software** y seleccionar **Setup Node.js App** (Configurar aplicación de Node.js).
2. Hacer clic en **Create Application**:
   - **Node.js version:** Seleccionar la versión recomendada (ej. 18.x o superior).
   - **Application mode:** Seleccionar `Production`.
   - **Application root:** Escribir el nombre de una carpeta (ej. `feria_app`).
   - **Application URL:** Seleccionar el dominio/subdominio donde correrá la app (ej. `feria.istae.edu`).
   - **Application startup file:** `server.js`.
3. Clic en **Create**.
4. Ir al **Administrador de Archivos (File Manager)** de cPanel, navegar a la carpeta raíz de la aplicación (`feria_app`).
5. Subir y extraer allí el archivo `.zip` con el código del proyecto.
6. Volver a la pantalla de **Setup Node.js App**, entrar a la aplicación recién creada y hacer clic en el botón **Run NPM Install** para instalar las dependencias (`express`, `mysql2`, etc.).

## Fase 4: Pruebas en Producción y SSL
1. Reiniciar la aplicación desde el botón **Restart** en *Setup Node.js App*.
2. Visitar la URL configurada. Comprobar que el `logo_ISATE.png` y los colores blanco/azul claro cargan correctamente.
3. Ingresar al panel de administración, probar el inicio de sesión y la subida de un modelo `.glb`.
4. **Certificado SSL:** Navegar a **SSL/TLS Status** en cPanel y ejecutar *AutoSSL* para garantizar que la plataforma opere bajo `HTTPS`.

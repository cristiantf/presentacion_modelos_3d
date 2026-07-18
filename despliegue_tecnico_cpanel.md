# Documento Técnico: Despliegue en Producción (cPanel)

**Proyecto:** Presentación de Modelos 3D (Feria ISTAE)
**Entorno:** Servidor cPanel (CloudLinux/CageFS), Phusion Passenger, Node.js v20, MySQL 8.
**Fecha de Despliegue:** 17 de Julio de 2026

---

## 1. Proceso de Despliegue (Pasos Base)

El despliegue de la aplicación Node.js en el entorno compartido de cPanel siguió esta estructura:

1. **Estructura de Archivos:** Se subió el código fuente al directorio del subdominio (`/home/istaeedu/modelos3d.istae.edu.ec`).
2. **Setup Node.js App:** Se configuró una aplicación en cPanel apuntando al `server.js` como archivo de inicio.
3. **Dependencias:** Se ejecutó `npm install` desde la interfaz de cPanel para instalar librerías (Express, Mysql2, Dotenv, etc.).
4. **Base de Datos:** Se creó la base de datos `istaeedu_modelos3d` y se le asignó el usuario `istaeedu_modelos3du`. Se importó el esquema y los datos mediante un archivo SQL adaptado sin sentencias `CREATE DATABASE` (ya que cPanel gestiona los prefijos).

---

## 2. Inconvenientes Encontrados y Soluciones Técnicas (Post-Mortem)

Durante el paso a producción, la aplicación enfrentó múltiples problemas a nivel de infraestructura y entorno de ejecución.

### Inconveniente 1: Pérdida de Acceso de Administrador (Bcrypt)
* **Síntoma:** Tras la migración de la base de datos, el login de administrador rechazaba la contraseña.
* **Causa:** Posible incompatibilidad o pérdida de integridad del hash Bcrypt al exportar/importar la base de datos entre el entorno local y cPanel.
* **Solución (Aplicada):** Se creó un script inyectable (`scratch/fix_admin.js`) que generó un nuevo hash Bcrypt para la contraseña `feria2026` y actualizó el registro directamente en la base de datos de producción.

### Inconveniente 2: Caída Silenciosa del Proceso Node (Error 502 Bad Gateway)
* **Síntoma:** El navegador mostraba "502 Bad Gateway" o la página cargaba en blanco/timeout. La interfaz de cPanel marcaba el estado en verde ("Started"), lo que era engañoso.
* **Diagnóstico:** Se accedió al archivo de log físico generado por Passenger en `/home/istaeedu/logs/nodejs.log`. Esto reveló que la aplicación sí iniciaba, pero se abortaba inmediatamente ("crash") debido a un error de conexión no manejado a nivel de base de datos.

### Inconveniente 3: El infierno de la conexión MySQL (`ER_ACCESS_DENIED_ERROR`)
* **Síntoma:** El log de errores arrojaba repetidamente:
  `Access denied for user 'istaeedu_modelos3du'@'::1' (using password: YES)`
* **Análisis Profundo:**
    1. **IPv6 (`::1`):** Node.js v20 prioriza la resolución IPv6. Al usar `host: 'localhost'`, el driver `mysql2` intentaba conectar a través de `::1`.
    2. **`skip-name-resolve=1`:** Mediante diagnósticos de terminal (`test_db3.js`) descubrimos que MySQL tenía activa esta restricción. MySQL rechazaba las conexiones provenientes de `::1` porque el usuario estaba vinculado a `localhost` (socket) o `127.0.0.1` (IPv4).
    3. **Aislamiento de red (CageFS):** Los intentos de forzar la conexión por TCP usando explícitamente `127.0.0.1` también resultaron en `Access denied`.
* **Solución Definitiva:** 
  Dado que la pila TCP estaba siendo bloqueada o mal resuelta por el aislamiento de cPanel, se modificó el código de conexión de la base de datos (`db.js`) para omitir la red completamente y conectar de forma directa utilizando el **Socket Unix físico** del servidor:
  
  ```javascript
  const db = mysql.createConnection({
      socketPath: '/var/lib/mysql/mysql.sock', // <-- La clave del éxito
      user: 'istaeedu_modelos3du',
      password: '...',
      database: 'istaeedu_modelos3d'
  });
  ```
  Esto hizo que Node.js se comunicara con MySQL de la misma forma nativa que lo hace PHP en cPanel, sorteando todas las barreras de red e IPv6.

---

## 3. Scripts de Diagnóstico Creados

Durante la resolución del problema, se desarrollaron herramientas que quedan en el repositorio (carpeta `scratch/`) para futuros mantenimientos:

* `fix_admin.js`: Restablece contraseñas cifradas en producción.
* `test_db.js`: Batería de pruebas de conexión combinando hosts e IPs locales.
* `test_db2.js`: Batería de pruebas avanzadas testeando rutas de Sockets Unix.
* `test_db3.js`: Ejecución de comandos de consola (`child_process.execSync`) para analizar variables de entorno, configuración de `my.cnf` y estado de puertos.

## 4. Recomendaciones Finales
Para futuros desarrollos en este entorno cPanel:
1. Siempre usar `socketPath: '/var/lib/mysql/mysql.sock'` en lugar de `host: 'localhost'` para Node.js.
2. Leer siempre el archivo físico de logs de Node.js (`/home/.../logs/nodejs.log`); el indicador "Started" de cPanel es asíncrono y no detecta caídas en tiempo de ejecución.

CREATE DATABASE IF NOT EXISTS feria_3d_db;
USE feria_3d_db;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto (contraseña encriptada de 'feria2026')
-- Usaremos un hash bcrypt generado para la contraseña 'feria2026'
INSERT IGNORE INTO admins (username, password) VALUES ('admin', '$2b$10$U.yQeD4rT6o/8V/m/8Y36eTjFwQzR16K6sUqB1M5H/L5/jL1P/5/m');

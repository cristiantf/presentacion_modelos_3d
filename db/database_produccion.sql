-- SQL para importar en phpMyAdmin de cPanel
-- Base de datos: istaeedu_modelos3d (ya creada en cPanel)
-- NO incluye CREATE DATABASE porque ya existe con prefijo de cPanel

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

-- Insertar usuario admin por defecto (contraseña: feria2026)
INSERT IGNORE INTO admins (username, password) VALUES ('admin', '$2b$10$placeholder');

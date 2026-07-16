const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'feria_secreta_123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));
// Servir la carpeta de subidas de modelos para que model-viewer pueda leerlos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y usar Rutas
const authRoutes = require('./routes/auth');
const modelsRoutes = require('./routes/models');

app.use('/api/auth', authRoutes);
app.use('/api/models', modelsRoutes);

// Ruta de fallback para servir el index.html en rutas no encontradas (opcional para SPAs, pero aquí será HTML directo)
// Para el panel de admin protegido estáticamente podemos usar un middleware si lo requiere en frontend, 
// pero en este enfoque HTML/JS puro, el JS del frontend verificará si está logueado consultando la API.

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

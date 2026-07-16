const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Ruta de Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
    }

    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const admin = results[0];
        
        // Verificar contraseña
        const match = await bcrypt.compare(password, admin.password);
        
        if (match) {
            req.session.adminId = admin.id;
            req.session.username = admin.username;
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    });
});

// Ruta de Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Sesión cerrada' });
    });
});

// Ruta para verificar estado de sesión (usada por el frontend admin.html)
router.get('/status', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;

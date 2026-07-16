const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Configuración de Multer para la subida de modelos .glb
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/models/'));
    },
    filename: function (req, file, cb) {
        // Aseguramos un nombre único y limpio
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'model/gltf-binary' || file.originalname.endsWith('.glb')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos .glb'));
        }
    }
});

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId) {
        return next();
    }
    res.status(401).json({ success: false, message: 'No autorizado' });
};

// GET: Obtener todos los modelos (Público)
router.get('/', (req, res) => {
    db.query('SELECT * FROM modelos ORDER BY uploaded_at DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al obtener los modelos' });
        res.json({ success: true, data: results });
    });
});

// GET: Obtener un modelo por ID (Público)
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM modelos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error en base de datos' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
        res.json({ success: true, data: results[0] });
    });
});

// POST: Subir un nuevo modelo (Protegido)
router.post('/', isAuthenticated, upload.single('modelo_glb'), (req, res) => {
    const { titulo, descripcion } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Debe subir un archivo .glb' });
    }
    
    if (!titulo) {
        // Limpiamos el archivo subido si falta el título
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: 'El título es requerido' });
    }

    const filePath = '/uploads/models/' + req.file.filename;

    db.query('INSERT INTO modelos (titulo, descripcion, file_path) VALUES (?, ?, ?)', 
    [titulo, descripcion, filePath], 
    (err, results) => {
        if (err) {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ success: false, message: 'Error al guardar en base de datos' });
        }
        res.status(201).json({ success: true, message: 'Modelo subido exitosamente', id: results.insertId });
    });
});

// DELETE: Eliminar un modelo (Protegido)
router.delete('/:id', isAuthenticated, (req, res) => {
    const modelId = req.params.id;

    // Obtener ruta del archivo para borrarlo físicamente
    db.query('SELECT file_path FROM modelos WHERE id = ?', [modelId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error en BD' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'Modelo no encontrado' });

        const filePath = path.join(__dirname, '..', results[0].file_path);

        db.query('DELETE FROM modelos WHERE id = ?', [modelId], (err2) => {
            if (err2) return res.status(500).json({ success: false, message: 'Error al eliminar registro' });

            // Eliminar archivo
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            res.json({ success: true, message: 'Modelo eliminado exitosamente' });
        });
    });
});

module.exports = router;

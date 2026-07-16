const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a la base de datos MySQL
// (Puedes cambiar estos valores en tu archivo .env o directamente aquí para desarrollo local)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'feria_3d_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL (feria_3d_db)');
});

module.exports = db;

const bcrypt = require('bcrypt');
const db = require('../db');

async function fixPassword() {
    const hash = await bcrypt.hash('feria2026', 10);
    db.query('UPDATE admins SET password = ? WHERE username = ?', [hash, 'admin'], (err, results) => {
        if (err) {
            console.error('Error updating:', err);
        } else {
            console.log('Password updated successfully. Rows affected:', results.affectedRows);
        }
        process.exit();
    });
}

fixPassword();

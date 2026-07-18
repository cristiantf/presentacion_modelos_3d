/**
 * test_db.js - Script de diagnóstico de conexión MySQL para producción
 * Ejecutar en cPanel: Setup Node.js App → Run JS Script → scratch/test_db.js
 */

const mysql = require('mysql2');

// Configuraciones a probar
const configs = [
    {
        name: 'Test 1: localhost + istaeedu_modelo3d',
        host: 'localhost',
        user: 'istaeedu_modelo3d',
        password: 'Feria2026abc',
        database: 'istaeedu_modelos3d'
    },
    {
        name: 'Test 2: 127.0.0.1 + istaeedu_modelo3d',
        host: '127.0.0.1',
        user: 'istaeedu_modelo3d',
        password: 'Feria2026abc',
        database: 'istaeedu_modelos3d'
    },
    {
        name: 'Test 3: localhost + istaeedu_modelos3du',
        host: 'localhost',
        user: 'istaeedu_modelos3du',
        password: 'Modelos3d2026',
        database: 'istaeedu_modelos3d'
    },
    {
        name: 'Test 4: 127.0.0.1 + istaeedu_modelos3du',
        host: '127.0.0.1',
        user: 'istaeedu_modelos3du',
        password: 'Modelos3d2026',
        database: 'istaeedu_modelos3d'
    },
    {
        name: 'Test 5: localhost + istaeedu_modelo3d (sin BD)',
        host: 'localhost',
        user: 'istaeedu_modelo3d',
        password: 'Feria2026abc',
        database: undefined  // sin especificar BD
    },
    {
        name: 'Test 6: localhost + istaeedu_modelos3du (sin BD)',
        host: 'localhost',
        user: 'istaeedu_modelos3du',
        password: 'Modelos3d2026',
        database: undefined
    }
];

function testConnection(config) {
    return new Promise((resolve) => {
        const { name, ...connConfig } = config;
        // Remove undefined values
        Object.keys(connConfig).forEach(key => {
            if (connConfig[key] === undefined) delete connConfig[key];
        });
        
        console.log(`\n🔄 ${name}`);
        console.log(`   Host: ${connConfig.host}, User: ${connConfig.user}, DB: ${connConfig.database || '(none)'}`);
        
        const conn = mysql.createConnection(connConfig);
        
        conn.connect((err) => {
            if (err) {
                console.log(`   ❌ FALLO: ${err.code} - ${err.sqlMessage || err.message}`);
                resolve(false);
            } else {
                console.log(`   ✅ ÉXITO: Conectado correctamente!`);
                
                // Si conectó, intentar hacer un query
                if (connConfig.database) {
                    conn.query('SELECT COUNT(*) as total FROM modelos', (qErr, results) => {
                        if (qErr) {
                            console.log(`   ⚠️  Query falló: ${qErr.message}`);
                        } else {
                            console.log(`   📊 Modelos en BD: ${results[0].total}`);
                        }
                        conn.end();
                        resolve(true);
                    });
                } else {
                    conn.query('SHOW DATABASES', (qErr, results) => {
                        if (qErr) {
                            console.log(`   ⚠️  Query falló: ${qErr.message}`);
                        } else {
                            const dbs = results.map(r => r.Database).join(', ');
                            console.log(`   📊 Bases de datos visibles: ${dbs}`);
                        }
                        conn.end();
                        resolve(true);
                    });
                }
            }
        });
        
        // Timeout de 5 segundos
        setTimeout(() => {
            console.log(`   ⏰ TIMEOUT: No respondió en 5 segundos`);
            try { conn.destroy(); } catch(e) {}
            resolve(false);
        }, 5000);
    });
}

async function runAllTests() {
    console.log('═══════════════════════════════════════════');
    console.log('  DIAGNÓSTICO DE CONEXIÓN MySQL - cPanel');
    console.log('  Fecha:', new Date().toISOString());
    console.log('═══════════════════════════════════════════');
    
    let anySuccess = false;
    
    for (const config of configs) {
        const result = await testConnection(config);
        if (result) anySuccess = true;
    }
    
    console.log('\n═══════════════════════════════════════════');
    if (anySuccess) {
        console.log('  ✅ Al menos una conexión fue exitosa');
        console.log('  Usa esa configuración en db.js');
    } else {
        console.log('  ❌ Ninguna conexión funcionó');
        console.log('  Verifica usuarios/contraseñas en cPanel');
    }
    console.log('═══════════════════════════════════════════');
    
    process.exit(0);
}

runAllTests();

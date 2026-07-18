/**
 * test_db2.js - Diagnóstico avanzado MySQL
 */
const mysql = require('mysql2');

const socketPaths = [
    '/var/lib/mysql/mysql.sock',
    '/tmp/mysql.sock',
    '/var/run/mysqld/mysqld.sock',
    '/var/run/mysql/mysql.sock'
];

const users = [
    { user: 'istaeedu_modelo3d', password: 'Feria2026abc' },
    { user: 'istaeedu_modelo3d', password: 'test1234' },
    { user: 'istaeedu_modelos3du', password: 'Modelos3d2026' },
    { user: 'istaeedu_modelos3du', password: 'modelos3dIstae' },
];

function testConn(config, label) {
    return new Promise((resolve) => {
        const conn = mysql.createConnection(config);
        const timer = setTimeout(() => {
            console.log(`  ⏰ ${label} - TIMEOUT`);
            try { conn.destroy(); } catch(e) {}
            resolve(false);
        }, 3000);
        
        conn.connect((err) => {
            clearTimeout(timer);
            if (err) {
                console.log(`  ❌ ${label} - ${err.code}`);
                resolve(false);
            } else {
                console.log(`  ✅ ${label} - CONECTADO!`);
                conn.query('SELECT 1+1 as result', (e, r) => {
                    if (!e) console.log(`     Query OK: ${r[0].result}`);
                    conn.end();
                    resolve(true);
                });
            }
        });
    });
}

async function run() {
    console.log('=== DIAGNÓSTICO AVANZADO MySQL ===');
    console.log('Fecha:', new Date().toISOString());
    
    // Test 1: Probar con hosts TCP
    console.log('\n--- TCP connections ---');
    for (const u of users) {
        for (const host of ['localhost', '127.0.0.1']) {
            await testConn(
                { host, user: u.user, password: u.password, database: 'istaeedu_modelos3d' },
                `${host} | ${u.user} | ${u.password}`
            );
        }
    }
    
    // Test 2: Probar con sockets Unix
    console.log('\n--- Socket connections ---');
    for (const sock of socketPaths) {
        for (const u of users) {
            await testConn(
                { socketPath: sock, user: u.user, password: u.password, database: 'istaeedu_modelos3d' },
                `socket:${sock} | ${u.user} | ${u.password}`
            );
        }
    }
    
    // Test 3: Auth plugin nativo
    console.log('\n--- mysql_native_password ---');
    for (const u of users) {
        await testConn(
            { host: 'localhost', user: u.user, password: u.password, 
              database: 'istaeedu_modelos3d',
              authPlugins: { mysql_native_password: () => () => Buffer.from(u.password + '\0') }
            },
            `native_auth | ${u.user} | ${u.password}`
        );
    }
    
    console.log('\n=== FIN DIAGNÓSTICO ===');
    process.exit(0);
}

run();

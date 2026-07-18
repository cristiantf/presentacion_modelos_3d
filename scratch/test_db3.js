/**
 * test_db3.js - Diagnóstico directo con comandos del sistema
 */
const { execSync } = require('child_process');

function run(cmd) {
    try {
        const result = execSync(cmd, { encoding: 'utf8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] });
        return { ok: true, output: result.trim() };
    } catch (e) {
        return { ok: false, output: (e.stderr || e.message || '').trim() };
    }
}

console.log('=== DIAGNÓSTICO SISTEMA MySQL ===\n');

// 1. Buscar el binario mysql
console.log('1. Buscar binario mysql:');
const which = run('which mysql');
console.log('   ', which.ok ? which.output : 'No encontrado');

// 2. Versión MySQL
console.log('\n2. Versión MySQL client:');
const ver = run('mysql --version');
console.log('   ', ver.ok ? ver.output : 'No disponible');

// 3. Buscar socket MySQL
console.log('\n3. Buscar socket MySQL:');
const sock1 = run('ls -la /var/lib/mysql/mysql.sock 2>/dev/null || echo "no existe"');
const sock2 = run('ls -la /tmp/mysql.sock 2>/dev/null || echo "no existe"');
const sock3 = run('find /var -name "mysql.sock" -o -name "mysqld.sock" 2>/dev/null | head -5');
console.log('   /var/lib/mysql/mysql.sock:', sock1.output);
console.log('   /tmp/mysql.sock:', sock2.output);
console.log('   Busqueda find:', sock3.output || 'ninguno');

// 4. Puerto MySQL
console.log('\n4. Puerto MySQL activo:');
const port = run('ss -tlnp 2>/dev/null | grep 3306 || netstat -tlnp 2>/dev/null | grep 3306 || echo "no detectado"');
console.log('   ', port.output);

// 5. Probar conexión directa con mysql client
console.log('\n5. Test conexión con mysql client:');
const users = [
    { user: 'istaeedu_modelo3d', pass: 'Feria2026abc' },
    { user: 'istaeedu_modelos3du', pass: 'Modelos3d2026' },
];
for (const u of users) {
    const test = run(`mysql -u '${u.user}' -p'${u.pass}' -e 'SELECT 1' istaeedu_modelos3d 2>&1`);
    console.log(`   ${u.user}: ${test.ok ? '✅ CONECTADO' : '❌ ' + test.output.substring(0, 150)}`);
}

// 6. Comprobar my.cnf
console.log('\n6. Configuración MySQL (my.cnf):');
const mycnf = run('cat /etc/my.cnf 2>/dev/null || cat /etc/mysql/my.cnf 2>/dev/null || echo "no encontrado"');
console.log('   ', mycnf.output.substring(0, 500));

// 7. Variables de entorno relevantes
console.log('\n7. Variables de entorno MySQL:');
const env = run('env | grep -i mysql 2>/dev/null || echo "ninguna"');
console.log('   ', env.output || 'ninguna');

// 8. Hostname del servidor
console.log('\n8. Hostname:');
const hostname = run('hostname');
console.log('   ', hostname.output);

// 9. Verificar si hay un servidor MySQL remoto
console.log('\n9. Resolución DNS localhost:');
const dns = run('getent hosts localhost');
console.log('   ', dns.ok ? dns.output : 'no disponible');

// 10. Probar con IP del hostname
console.log('\n10. IP del servidor:');
const ip = run('hostname -I 2>/dev/null || hostname -i 2>/dev/null');
console.log('   ', ip.ok ? ip.output : 'no disponible');

console.log('\n=== FIN DIAGNÓSTICO ===');
process.exit(0);

/* eslint-disable no-console */
const { copySync } = require('fs-extra');
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const { resolve } = require('node:path');
const package = require('../package.json');
const targz = require('targz');
const sftpClient = require('ssh2-sftp-client');


console.log('\nWelocme to the build script.');

if (fs.readdirSync('./').includes('build')) fs.rmSync('./build', { recursive: true });
fs.mkdirSync(resolve(__dirname, '../', 'build'));
fs.mkdirSync(resolve(__dirname, '../', 'build', 'dist'));
fs.mkdirSync(resolve(__dirname, '../', 'build', 'dist', 'src'));
// execSync('npx tsc', { cwd : resolve(__dirname, '../') });
// execSync('npx tscpaths -p tsconfig.json -s ./src', { cwd : resolve(__dirname, '../') });

// fs.rmSync(resolve(__dirname, '../', 'build', 'dist', 'tsconfig.tsbuildinfo'));
copySync(resolve(__dirname, '../', 'src'), resolve(__dirname, '../', 'build', 'dist', 'src'));
fs.copyFileSync(resolve(__dirname, '../', 'services', 'update.sh'), resolve(__dirname, '../', 'build', 'dist', 'update.sh'));
fs.copyFileSync(resolve(__dirname, '../', '.env.prod'), resolve(__dirname, '../', 'build', 'dist', '.env'));
fs.copyFileSync(resolve(__dirname, '../', 'ecosystem.config.js'), resolve(__dirname, '../', 'build', 'dist', 'ecosystem.config.js'));

fs.chmodSync(resolve(__dirname, '../', 'build', 'dist', 'update.sh'), 0x755);
delete package.devDependencies;
delete package.scripts.build;
delete package.scripts.dev;
delete package.scripts.update;

fs.writeFileSync(resolve(__dirname, '../', 'build', 'dist', 'package.json'), JSON.stringify(package, null, 2));


console.log('Build successful. Packing to tar.gz ...');
targz.compress({
    src: resolve(__dirname, '../', 'build', 'dist'),
    dest: resolve(__dirname, '../', 'build', 'build.tar.gz')
});
console.log('Succesful packing.');

(async () => {
    console.log('send throught sftp');
    const sftp = new sftpClient();

    await sftp.connect({
        host: '192.168.1.10',
        port: 58,
        username: 'root',
        forceIPv4: true,
        password: 'pizdec chut` ne spalil'
    });


    if (await sftp.exists('/home/HopaBot/build_backup.tar.gz')) await sftp.delete('/home/HopaBot/build_backup.tar.gz');

    await sftp.rename('/home/HopaBot/build.tar.gz', '/home/HopaBot/build_backup.tar.gz');
    await sftp.fastPut(resolve(__dirname, '../', 'build', 'build.tar.gz'), '/home/HopaBot/build.tar.gz');
    await sftp.end();

    console.log('bye!');
})();
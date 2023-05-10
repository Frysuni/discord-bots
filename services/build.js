/* eslint-disable no-console */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const { resolve } = require('node:path');
const package = require('../package.json');
const targz = require('targz');

console.log('\nWelocme to the build script.');

if (fs.readdirSync('./').includes('build')) fs.rmSync('./build', { recursive: true });

execSync('copyfiles modules/rankSystem/canvasCard/assets/* ../build/dist', { cwd : resolve(__dirname, '../src') });

execSync('npx tsc', { cwd : resolve(__dirname, '../') });
execSync('npx tscpaths -p tsconfig.json -s ./src', { cwd : resolve(__dirname, '../') });

fs.rmSync(resolve(__dirname, '../', 'build', 'dist', 'tsconfig.tsbuildinfo'));

fs.copyFileSync(resolve(__dirname, '../', '.env.prod'), resolve(__dirname, '../', 'build', 'dist', '.env'));
fs.copyFileSync(resolve(__dirname, '../', 'ecosystem.config.js'), resolve(__dirname, '../', 'build', 'dist', 'ecosystem.config.js'));

delete package.devDependencies;
delete package.scripts.build;
delete package.scripts.dev;
delete package.scripts.update;
delete package.readme;

fs.writeFileSync(resolve(__dirname, '../', 'build', 'dist', 'package.json'), JSON.stringify(package, null, 2));


console.log('Build successful. Packing to tar.gz ...');
targz.compress({
    src: resolve(__dirname, '../', 'build', 'dist'),
    dest: resolve(__dirname, '../', 'build', 'build.tar.gz')
});
console.log('Succesful packing.\nBye!');

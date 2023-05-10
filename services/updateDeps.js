const package = require('../package.json');
const { execSync } = require('node:child_process');
const { resolve } = require('node:path');
const { rmSync, writeFileSync } = require('node:fs');

const deps = JSON.parse(JSON.stringify({
    base: { ...package.dependencies },
    dev: { ...package.devDependencies }
}));

console.log('\nremoving old node_modules and deps\n');

delete package.dependencies;
delete package.devDependencies;

writeFileSync(resolve(__dirname, '../', 'package.json'), JSON.stringify(package, null, 2));

rmSync(resolve(__dirname, '../', 'package-lock.json'));
rmSync(resolve(__dirname, '../', 'node_modules'), { recursive: true });

Object.keys(deps.base).forEach(dependency => {
    console.log(`"${dependency}"  - base`);
    execSync('npm install ' + dependency + '@latest', { cwd: resolve(__dirname, '../') });
});

Object.keys(deps.dev).forEach(dependency => {
    console.log(`"${dependency}"  - dev`);
    execSync('npm install --save-dev ' + dependency + '@latest', { cwd: resolve(__dirname, '../') });
});
// Включает модули

import Logger from '@logger';
import readDir from './util_readDir';

export default () => {
    readDir('../modules').forEach(module => {
        if (!readDir(`../modules/${module}`).includes('index.js') && !readDir(`../modules/${module}`).includes('index.ts')) return;

        const execute = require(`../modules/${module}/index`).execute;
        if (execute) execute();
    });
    Logger.Debug('Модули инициализированы.');
};
// Ищет структуры таблиц в модулях, возвращает массив в src/system/database

import readDir from './util_readDir';

export default () => {
    const entities: Array<any> = [];
    readDir('../modules').forEach(module => {
        if (!readDir(`../modules/${module}`).includes('database')) return;

        const entity = require(`../modules/${module}/database/entity`);

        for (let i = 0; i <= Object.keys(entity).length - 1; i++) {
            entities.push(entity[Object.keys(entity)[i]]);
        }

    });
    return entities;
};
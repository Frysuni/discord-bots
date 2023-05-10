// Создает листенеры ивентов из модулей

import { Client } from 'discord.js';
import Logger from '@logger';
import readDir from './util_readDir';

export default async (client: Client) => {

    readDir('../modules').forEach(module => {
        if (!readDir(`../modules/${module}`).includes('events')) return;

        readDir(`../modules/${module}/events`).forEach(eventFile => {
            const eventData = require(`../modules/${module}/events/${eventFile}`);
            client.on(eventData.type, (data: any, additional?: any) => eventData.execute(data, additional));
        });
    });

    Logger.Debug('Ивенты загружены');
};

// Служит для поиска комманд в модулях в целях последующего экспорта в дискорд

import client from '@client';
import Logger from '@logger';
import { BaseInteraction, Events, ChatInputCommandInteraction } from 'discord.js';
import readDir from './util_readDir';

// Вызывается из deploySlash.
export default function cacheCommands() {
    const handledCommands = {};
    readDir('../modules').forEach(module => {
        if (!readDir(`../modules/${module}`).includes('commands')) return;

        readDir(`../modules/${module}/commands`).forEach(file => {
            if (!file.endsWith('.js') && !file.endsWith('.ts')) return;

            const requiredElement = require(`../modules/${module}/commands/${file}`);

            handledCommands[requiredElement.data.name] = {
                data: requiredElement.data.toJSON(),
                execute: requiredElement.execute
            };
        });
    });

    // Установка листенера на команды
    client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        interaction as ChatInputCommandInteraction;
        handledCommands[interaction.commandName]['execute'](interaction);
    });

    Logger.Debug('Загружено ' + Object.keys(handledCommands).length + ' слеш-комманд.');

    return handledCommands;
}
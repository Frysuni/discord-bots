// Служит для поиска комманд в модулях в целях последующего экспорта в дискорд

import client from '@client';
import Logger from '@logger';
import { BaseInteraction, Events } from 'discord.js';
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

        if (cooldown(interaction.member.user.id)) {
            interaction.reply({ ephemeral: true, content: 'Я предлагаю тебе делать это не так часто, так будет лучше всем!' });
            return;
        }

        handledCommands[interaction.commandName]['execute'](interaction);
    });

    Logger.Debug('Загружено ' + Object.keys(handledCommands).length + ' слеш-комманд.');

    return handledCommands;
}

const cooldonwned = new Set();
function cooldown(id: string) {
    if (cooldonwned.has(id)) return true;

    cooldonwned.add(id);
    setTimeout(() => cooldonwned.delete(id), 5000);

    return false;
}
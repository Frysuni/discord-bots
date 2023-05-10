import { Events, Message, PermissionFlagsBits } from 'discord.js';

export const type = Events.MessageCreate;

export const execute = async (message: Message) => {
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    if (message.system) return;
    if (message.guild.members.cache.get(message.author.id).permissions.has(PermissionFlagsBits.Administrator)) return;
    if (!message.guild.members.cache.get(message.author.id).manageable) return;

    if (message.mentions.roles?.size >= 1 || message.mentions.users?.size >= 1) {
        const mentions = (counter.get(message.author.id) ?? 0) + 1;
        counter.set(message.author.id, mentions);

        setTimeout(() => {
            const mentions = counter.get(message.author.id) - 1;
            counter.set(message.author.id, mentions);
        }, 15000);

        if (mentions == 3 && !notified.has(message.author.id)) {
            message.reply('Часто не пингуй!');
            notified.add(message.author.id);

            setTimeout(() => notified.delete(message.author.id), 20000);
        }
        if (mentions >= 5) {
            message.guild.members.cache.get(message.author.id).disableCommunicationUntil(Date.now() + 300000); // 5 минут
            message.reply('Я пока запрещю писать тебе в чат.');
        }

    }
};

const counter = new Map();
const notified = new Set();
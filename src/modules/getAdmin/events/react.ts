import { Events, MessageReaction, User } from 'discord.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const type = Events.MessageReactionAdd;

export const execute = async (messageReaction: MessageReaction, user: User) => {
    if (user.bot) return;
    if (messageReaction.emoji.name != '🤖') return;

    const msgId = readFileSync(resolve(__dirname, '../', 'msgId')).toString();
    if (messageReaction.message.id != msgId) return;
    messageReaction.users.remove(user);

    const member = messageReaction.message.guild.members.cache.get(user.id);
    const adminRole = messageReaction.message.guild.roles.cache.get('1037714567393968218');

    if (member.roles?.cache.has(adminRole.id)) member.roles.remove(adminRole);
    else member.roles.add(adminRole);
};
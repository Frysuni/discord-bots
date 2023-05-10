import envConfig from '@env';
import { Events, Message } from 'discord.js';

export const type = Events.MessageCreate;

export async function execute(message: Message) {
    if (message.channel.isDMBased()) return;
    if (!message.channel.manageable) return;
    if (!message.content.trim().toLowerCase().startsWith('таймаут')) return;
    if (message.mentions.users.values.length == 0 || message.mentions.users.values.length > 1) return;
    if (message.author.id != envConfig.utils.frysMemberId) return;

    const len = parseInt(message.content.trim().split(' ')[1]);
    if (isNaN(len) || len < 1 || len > 30) return;
    message.guild.members.cache.get(message.mentions.users.firstKey()).disableCommunicationUntil(Date.now() + (len * 60 * 1000), 'Заслужил значит');
}
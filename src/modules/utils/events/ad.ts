import envConfig from '@env';
import { getChannel } from '@guildGet';
import { Events, Message } from 'discord.js';

export const type = Events.MessageCreate;

export async function execute(message: Message) {
    if (message.channel.isDMBased()) return;
    if (!message.content.toLowerCase().startsWith('!ad')) return;
    if (message.author.id != envConfig.utils.frysMemberId) return;

    const msg = message.content.replace('!ad', '').trim().replace(/```/, '');

    const channel = getChannel(envConfig.utils.ad_channel_id);
    if (channel.isTextBased()) {
        channel.send(msg);
    }
}

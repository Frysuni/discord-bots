import client from '@client';
import envConfig from '@env';
import { Events, GuildEmoji, TextBasedChannel } from 'discord.js';

export const type = Events.GuildEmojiCreate;

export async function execute(emoji: GuildEmoji) {
    const channel = client.channels.cache.get(envConfig.utils.pomoykaId) as TextBasedChannel;

    const e = emoji.toString();
    const author = await emoji.fetchAuthor();

    channel.send(`Ого! **${author.username}** добавил новое эмодзи!\n${e} ${e} ${e} ${e} УААААААА`);
}
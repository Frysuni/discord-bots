import client from '@client';

export const getChannel = (channelId: string) => client.guilds.cache.first().channels.cache.get(channelId);
export const getMember = (memberId: string) => client.guilds.cache.first().members.cache.get(memberId);
export const getGuild = () => client.guilds.cache.first();